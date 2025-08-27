package handlers

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"math"
	"io"
	"net/http"
	"strconv"
	"strings"

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

	// Parse webhook JSON
	var body map[string]interface{}
	if err := json.Unmarshal(payload, &body); err != nil {
		h.logger.Warn("razorpay webhook invalid JSON", zap.Error(err))
		// Acknowledge to avoid retries but do nothing.
		c.Status(http.StatusOK)
		return
	}

	eventType, _ := body["event"].(string)
	payloadMap, _ := body["payload"].(map[string]interface{})

	// Extract payment and order entities if present
	var paymentEntity map[string]interface{}
	if pm, ok := payloadMap["payment"].(map[string]interface{}); ok {
		if ent, ok := pm["entity"].(map[string]interface{}); ok {
			paymentEntity = ent
		}
	}
	var orderEntity map[string]interface{}
	if od, ok := payloadMap["order"].(map[string]interface{}); ok {
		if ent, ok := od["entity"].(map[string]interface{}); ok {
			orderEntity = ent
		}
	}

	var providerPaymentID string
	var rzpOrderID string
	var amountRupees float64
	currency := "INR"
	var localOrderID int64

	if paymentEntity != nil {
		if v, ok := paymentEntity["id"].(string); ok {
			providerPaymentID = v
		}
		if v, ok := paymentEntity["order_id"].(string); ok {
			rzpOrderID = v
		}
		// amount in paise -> convert to rupees
		if v, ok := paymentEntity["amount"].(float64); ok {
			amountRupees = v / 100.0
		}
		if v, ok := paymentEntity["currency"].(string); ok && v != "" {
			currency = v
		}
		if notes, ok := paymentEntity["notes"].(map[string]interface{}); ok {
			if oid, ok := notes["order_id"]; ok {
				switch t := oid.(type) {
				case float64:
					localOrderID = int64(t)
				case string:
					if id64, err := strconv.ParseInt(t, 10, 64); err == nil {
						localOrderID = id64
					}
				}
			}
		}
	}

	var orderReceipt string
	if orderEntity != nil {
		if v, ok := orderEntity["id"].(string); ok && rzpOrderID == "" {
			rzpOrderID = v
		}
		if v, ok := orderEntity["receipt"].(string); ok {
			orderReceipt = v
		}
	}

	if localOrderID == 0 && orderReceipt != "" && strings.HasPrefix(orderReceipt, "order_") {
		if id64, err := strconv.ParseInt(strings.TrimPrefix(orderReceipt, "order_"), 10, 64); err == nil {
			localOrderID = id64
		}
	}

	if localOrderID == 0 && providerPaymentID != "" {
		// Fallback: find existing payment record
		var existingOrderID int64
		if err := h.db.QueryRow("SELECT order_id FROM payments WHERE provider_ref = $1", providerPaymentID).Scan(&existingOrderID); err == nil {
			localOrderID = existingOrderID
		}
	}

	// Determine payment status based on event type
	paymentStatus := ""
	switch eventType {
	case "payment.captured", "order.paid":
		paymentStatus = "succeeded"
	case "payment.failed", "order.payment_failed":
		paymentStatus = "failed"
	}

	// Upsert payments row when we have both payment id and local order id
	if providerPaymentID != "" && localOrderID != 0 {
		raw := json.RawMessage(payload)
		statusForUpsert := paymentStatus
		if statusForUpsert == "" {
			// For intermediate or unknown events, keep processing state
			statusForUpsert = "processing"
		}
		if _, err := h.db.Exec(
			`INSERT INTO payments (order_id, provider, provider_ref, status, amount, currency, raw_webhook_json)
             VALUES ($1,$2,$3,$4,$5,$6,$7)
             ON CONFLICT (provider_ref) DO UPDATE SET status = EXCLUDED.status, amount = EXCLUDED.amount, currency = EXCLUDED.currency, raw_webhook_json = EXCLUDED.raw_webhook_json`,
			localOrderID, "razorpay", providerPaymentID, statusForUpsert, amountRupees, currency, raw,
		); err != nil {
			h.logger.Error("failed to upsert payment from webhook", zap.Error(err))
			// Still ack to prevent retries; reconciliation can happen later
			c.Status(http.StatusOK)
			return
		}
	}

	// Update order status if resolvable
	if localOrderID != 0 && paymentStatus != "" {
		switch paymentStatus {
		case "succeeded":
			if providerPaymentID != "" {
				if _, err := h.db.Exec("UPDATE orders SET status = 'paid', payment_id = $1 WHERE id = $2", providerPaymentID, localOrderID); err != nil {
					h.logger.Error("failed to update order to paid", zap.Error(err))
				}
			} else {
				if _, err := h.db.Exec("UPDATE orders SET status = 'paid' WHERE id = $1", localOrderID); err != nil {
					h.logger.Error("failed to update order to paid (no payment id)", zap.Error(err))
				}
			}
		case "failed":
			// Only set to payment_failed if still pending to avoid overriding paid
			if _, err := h.db.Exec("UPDATE orders SET status = 'payment_failed' WHERE id = $1 AND status = 'pending'", localOrderID); err != nil {
				h.logger.Warn("failed to update order to payment_failed (non-blocking)", zap.Error(err))
			}
		}
	} else if localOrderID == 0 {
		h.logger.Warn("razorpay webhook could not resolve local order_id", zap.String("event", eventType), zap.String("rzp_order_id", rzpOrderID), zap.String("payment_id", providerPaymentID))
	}

	c.Status(http.StatusOK)
}
