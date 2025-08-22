package handlers

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"math"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/razorpay/razorpay-go"
	"github.com/razorpay/razorpay-go/utils"
	"go.uber.org/zap"

	"finspeed/api/internal/config"
	"finspeed/api/internal/database"
)

type PaymentHandler struct {
	db     *database.DB
	logger *zap.Logger
	cfg    *config.Config
}

func NewPaymentHandler(db *database.DB, logger *zap.Logger, cfg *config.Config) *PaymentHandler {
	return &PaymentHandler{db: db, logger: logger, cfg: cfg}
}

type createRazorpayOrderRequest struct {
	OrderID int64 `json:"order_id" binding:"required"`
}

type createRazorpayOrderResponse struct {
	OrderID         int64  `json:"order_id"`
	RazorpayOrderID string `json:"razorpay_order_id"`
	Amount          int64  `json:"amount"`    // in paise
	Currency        string `json:"currency"`  // e.g., INR
	KeyID           string `json:"key_id"`
}

// CreateRazorpayOrder handles POST /api/v1/payments/razorpay/order (protected)
// It verifies the order belongs to the user and is pending, then creates a Razorpay Order.
func (h *PaymentHandler) CreateRazorpayOrder(c *gin.Context) {
	if h.cfg.RazorpayKeyID == "" || h.cfg.RazorpayKeySecret == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Razorpay is not configured"})
		return
	}

	userIDVal, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDVal.(int64)

	var req createRazorpayOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.Warn("invalid razorpay order request", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Verify order belongs to user and is pending
	var (
		status string
		total  float64
	)
	err := h.db.QueryRow(
		"SELECT status, total FROM orders WHERE id = $1 AND user_id = $2",
		req.OrderID, userID,
	).Scan(&status, &total)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
			return
		}
		h.logger.Error("failed to fetch order", zap.Int64("order_id", req.OrderID), zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Razorpay order"})
		return
	}
	if status != "pending" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Order is not pending"})
		return
	}

	amountPaise := int64(math.Round(total * 100))

	client := razorpay.NewClient(h.cfg.RazorpayKeyID, h.cfg.RazorpayKeySecret)
	data := map[string]interface{}{
		"amount":          amountPaise,
		"currency":        "INR",
		"receipt":         fmt.Sprintf("order_%d", req.OrderID),
		"payment_capture": 1,
		"notes": map[string]interface{}{
			"order_id": req.OrderID,
			"user_id":  userID,
		},
	}

	rzpOrder, err := client.Order.Create(data, nil)
	if err != nil {
		h.logger.Error("razorpay order create failed", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to create Razorpay order"})
		return
	}

	rzpOrderID, _ := rzpOrder["id"].(string)

	resp := createRazorpayOrderResponse{
		OrderID:         req.OrderID,
		RazorpayOrderID: rzpOrderID,
		Amount:          amountPaise,
		Currency:        "INR",
		KeyID:           h.cfg.RazorpayKeyID,
	}
	c.JSON(http.StatusOK, resp)
}

// VerifyRazorpayPayment handles POST /api/v1/payments/razorpay/verify (protected)
// It verifies the signature sent by Razorpay after checkout success.
type verifyRazorpayPaymentRequest struct {
	OrderID           int64  `json:"order_id" binding:"required"`
	RazorpayOrderID   string `json:"razorpay_order_id" binding:"required"`
	RazorpayPaymentID string `json:"razorpay_payment_id" binding:"required"`
	RazorpaySignature string `json:"razorpay_signature" binding:"required"`
}

func (h *PaymentHandler) VerifyRazorpayPayment(c *gin.Context) {
	if h.cfg.RazorpayKeySecret == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Razorpay is not configured"})
		return
	}

	userIDVal, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDVal.(int64)

	var req verifyRazorpayPaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.Warn("invalid razorpay verify request", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Verify order belongs to user and is pending
	var (
		status string
		total  float64
	)
	err := h.db.QueryRow(
		"SELECT status, total FROM orders WHERE id = $1 AND user_id = $2",
		req.OrderID, userID,
	).Scan(&status, &total)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
			return
		}
		h.logger.Error("failed to fetch order", zap.Int64("order_id", req.OrderID), zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify payment"})
		return
	}
	if status != "pending" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Order is not pending"})
		return
	}

	params := map[string]interface{}{
		"razorpay_order_id":   req.RazorpayOrderID,
		"razorpay_payment_id": req.RazorpayPaymentID,
	}
	valid := utils.VerifyPaymentSignature(params, req.RazorpaySignature, h.cfg.RazorpayKeySecret)
	if !valid {
		h.logger.Warn("razorpay signature verification failed")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Signature verification failed"})
		return
	}

	// Upsert payment record and mark order paid
	rawPayload, _ := json.Marshal(params)
	amount := total
	currency := "INR"
	var paymentRowID int64
	if err := h.db.QueryRow(
		`INSERT INTO payments (order_id, provider, provider_ref, status, amount, currency, raw_webhook_json)
		 VALUES ($1,$2,$3,$4,$5,$6,$7)
		 ON CONFLICT (provider_ref) DO UPDATE SET status = EXCLUDED.status, raw_webhook_json = EXCLUDED.raw_webhook_json
		 RETURNING id`,
		req.OrderID, "razorpay", req.RazorpayPaymentID, "succeeded", amount, currency, json.RawMessage(rawPayload),
	).Scan(&paymentRowID); err != nil {
		h.logger.Error("failed to upsert payment", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to record payment"})
		return
	}

	if _, err := h.db.Exec("UPDATE orders SET status = 'paid', payment_id = $1 WHERE id = $2", req.RazorpayPaymentID, req.OrderID); err != nil {
		h.logger.Error("failed to update order status", zap.Error(err))
		// still return OK to frontend; the core payment is verified
	}

	c.JSON(http.StatusOK, gin.H{"status": "verified"})
}

// RazorpayWebhook handles POST /api/v1/payments/razorpay/webhook (public)
// Verifies webhook signature and acknowledges. Optional enrichment can be added.
func (h *PaymentHandler) RazorpayWebhook(c *gin.Context) {
	if h.cfg.RazorpayWebhookSecret == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Webhook secret not configured"})
		return
	}

	payload, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}
	c.Request.Body = io.NopCloser(bytes.NewBuffer(payload))

	sig := c.GetHeader("X-Razorpay-Signature")
	if !utils.VerifyWebhookSignature(string(payload), sig, h.cfg.RazorpayWebhookSecret) {
		h.logger.Warn("razorpay webhook signature verification failed")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Signature verification failed"})
		return
	}

	// Optionally parse event and update DB. For now, acknowledge.
	c.Status(http.StatusOK)
}
