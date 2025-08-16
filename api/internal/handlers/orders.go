package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"finspeed/api/internal/database"
)

type OrderHandler struct {
	db     *database.DB
	logger *zap.Logger
}

type Order struct {
	ID                  int64         `json:"id"`
	UserID              int64         `json:"user_id"`
	Status              string        `json:"status"`
	Subtotal            float64       `json:"subtotal"`
	ShippingFee         float64       `json:"shipping_fee"`
	TaxAmount           float64       `json:"tax_amount"`
	Total               float64       `json:"total"`
	PaymentID           *string       `json:"payment_id,omitempty"`
	ShippingAddressJSON ShippingAddr  `json:"shipping_address"`
	CreatedAt           string        `json:"created_at"`
	Items               []OrderItem   `json:"items,omitempty"`
	Payment             *Payment      `json:"payment,omitempty"`
}

type OrderItem struct {
	ID        int64   `json:"id"`
	OrderID   int64   `json:"order_id"`
	ProductID int64   `json:"product_id"`
	Qty       int     `json:"qty"`
	PriceEach float64 `json:"price_each"`
	Product   *Product `json:"product,omitempty"`
}

type ShippingAddr struct {
	Name     string `json:"name"`
	Phone    string `json:"phone"`
	Address1 string `json:"address1"`
	Address2 string `json:"address2,omitempty"`
	City     string `json:"city"`
	State    string `json:"state"`
	Pincode  string `json:"pincode"`
	Country  string `json:"country"`
}

type Payment struct {
	ID             int64                  `json:"id"`
	OrderID        int64                  `json:"order_id"`
	Provider       *string                `json:"provider,omitempty"`
	ProviderRef    *string                `json:"provider_ref,omitempty"`
	Status         string                 `json:"status"`
	Amount         float64                `json:"amount"`
	Currency       *string                `json:"currency,omitempty"`
	RawWebhookJSON map[string]interface{} `json:"raw_webhook_json,omitempty"`
	CreatedAt      string                 `json:"created_at"`
}

type CreateOrderRequest struct {
	Items           []CreateOrderItem `json:"items" binding:"required,min=1"`
	ShippingAddress ShippingAddr      `json:"shipping_address" binding:"required"`
}

type CreateOrderItem struct {
	ProductID int `json:"product_id" binding:"required"`
	Qty       int `json:"qty" binding:"required,min=1"`
}

type OrdersResponse struct {
	Orders []Order `json:"orders"`
	Total  int     `json:"total"`
	Page   int     `json:"page"`
	Limit  int     `json:"limit"`
}

func NewOrderHandler(db *database.DB, logger *zap.Logger) *OrderHandler {
	return &OrderHandler{
		db:     db,
		logger: logger,
	}
}

// GetOrders handles GET /api/v1/orders
func (h *OrderHandler) GetOrders(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse query parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 50 {
		limit = 10
	}
	
	offset := (page - 1) * limit

	// Get total count
	var total int
	countQuery := "SELECT COUNT(*) FROM orders WHERE user_id = $1"
	if err := h.db.QueryRow(countQuery, userID).Scan(&total); err != nil {
		h.logger.Error("Failed to get orders count", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}

	// Get orders
	query := `
		SELECT id, user_id, status, subtotal, shipping_fee, tax_amount, total, 
		       payment_id, shipping_address_json, created_at
		FROM orders 
		WHERE user_id = $1
		ORDER BY created_at DESC 
		LIMIT $2 OFFSET $3
	`

	rows, err := h.db.Query(query, userID, limit, offset)
	if err != nil {
		h.logger.Error("Failed to fetch orders", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}
	defer rows.Close()

	var orders []Order
	for rows.Next() {
		var o Order
		var shippingJSON []byte
		
		err := rows.Scan(
			&o.ID, &o.UserID, &o.Status, &o.Subtotal, &o.ShippingFee, &o.TaxAmount,
			&o.Total, &o.PaymentID, &shippingJSON, &o.CreatedAt,
		)
		if err != nil {
			h.logger.Error("Failed to scan order", zap.Error(err))
			continue
		}

		// Parse shipping address JSON
		if err := json.Unmarshal(shippingJSON, &o.ShippingAddressJSON); err != nil {
			h.logger.Warn("Failed to parse shipping address", zap.Int64("order_id", o.ID), zap.Error(err))
		}

		orders = append(orders, o)
	}

	// Get order items for each order
	for i := range orders {
		items, err := h.getOrderItems(orders[i].ID)
		if err != nil {
			h.logger.Warn("Failed to fetch order items", zap.Int64("order_id", orders[i].ID), zap.Error(err))
		} else {
			orders[i].Items = items
		}
	}

	c.JSON(http.StatusOK, OrdersResponse{
		Orders: orders,
		Total:  total,
		Page:   page,
		Limit:  limit,
	})
}

// GetOrder handles GET /api/v1/orders/:id
func (h *OrderHandler) GetOrder(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	orderID := c.Param("id")
	if orderID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Order ID is required"})
		return
	}

	var o Order
	var shippingJSON []byte
	
	query := `
		SELECT id, user_id, status, subtotal, shipping_fee, tax_amount, total, 
		       payment_id, shipping_address_json, created_at
		FROM orders 
		WHERE id = $1 AND user_id = $2
	`

	err := h.db.QueryRow(query, orderID, userID).Scan(
		&o.ID, &o.UserID, &o.Status, &o.Subtotal, &o.ShippingFee, &o.TaxAmount,
		&o.Total, &o.PaymentID, &shippingJSON, &o.CreatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
			return
		}
		h.logger.Error("Failed to fetch order", zap.String("order_id", orderID), zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch order"})
		return
	}

	// Parse shipping address JSON
	if err := json.Unmarshal(shippingJSON, &o.ShippingAddressJSON); err != nil {
		h.logger.Warn("Failed to parse shipping address", zap.Int64("order_id", o.ID), zap.Error(err))
	}

	// Get order items
	items, err := h.getOrderItems(o.ID)
	if err != nil {
		h.logger.Warn("Failed to fetch order items", zap.Int64("order_id", o.ID), zap.Error(err))
	} else {
		o.Items = items
	}

	// Get payment info if exists
	if o.PaymentID != nil {
		payment, err := h.getPayment(o.ID)
		if err != nil {
			h.logger.Warn("Failed to fetch payment", zap.Int64("order_id", o.ID), zap.Error(err))
		} else {
			o.Payment = payment
		}
	}

	c.JSON(http.StatusOK, o)
}

// CreateOrder handles POST /api/v1/orders
func (h *OrderHandler) CreateOrder(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var req CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.Warn("Invalid create order request", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Start transaction
	tx, err := h.db.Begin()
	if err != nil {
		h.logger.Error("Failed to start transaction", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}
	defer tx.Rollback()

	// Calculate totals
	var subtotal float64
	var validItems []CreateOrderItem

	for _, item := range req.Items {
		// Get product price and validate stock
		var price float64
		var stockQty int
		err := tx.QueryRow("SELECT price, stock_qty FROM products WHERE id = $1", item.ProductID).Scan(&price, &stockQty)
		if err != nil {
			if err == sql.ErrNoRows {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Product not found", "product_id": item.ProductID})
				return
			}
			h.logger.Error("Failed to fetch product", zap.Int("product_id", item.ProductID), zap.Error(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to validate products"})
			return
		}

		if stockQty < item.Qty {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock", "product_id": item.ProductID, "available": stockQty})
			return
		}

		subtotal += price * float64(item.Qty)
		validItems = append(validItems, item)
	}

	// Calculate shipping and tax (simplified)
	shippingFee := 50.0 // Fixed shipping fee
	if subtotal > 500 {
		shippingFee = 0.0 // Free shipping above 500
	}
	taxAmount := subtotal * 0.18 // 18% GST
	total := subtotal + shippingFee + taxAmount

	// Marshal shipping address
	shippingJSON, err := json.Marshal(req.ShippingAddress)
	if err != nil {
		h.logger.Error("Failed to marshal shipping address", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	// Create order
	var orderID int64
	orderQuery := `
		INSERT INTO orders (user_id, status, subtotal, shipping_fee, tax_amount, total, shipping_address_json)
		VALUES ($1, 'pending', $2, $3, $4, $5, $6)
		RETURNING id
	`

	err = tx.QueryRow(orderQuery, userID, subtotal, shippingFee, taxAmount, total, shippingJSON).Scan(&orderID)
	if err != nil {
		h.logger.Error("Failed to create order", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	// Create order items and update stock
	for _, item := range validItems {
		var price float64
		err := tx.QueryRow("SELECT price FROM products WHERE id = $1", item.ProductID).Scan(&price)
		if err != nil {
			h.logger.Error("Failed to get product price", zap.Int("product_id", item.ProductID), zap.Error(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
			return
		}

		// Insert order item
		_, err = tx.Exec(
			"INSERT INTO order_items (order_id, product_id, qty, price_each) VALUES ($1, $2, $3, $4)",
			orderID, item.ProductID, item.Qty, price,
		)
		if err != nil {
			h.logger.Error("Failed to create order item", zap.Error(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
			return
		}

		// Update stock
		_, err = tx.Exec("UPDATE products SET stock_qty = stock_qty - $1 WHERE id = $2", item.Qty, item.ProductID)
		if err != nil {
			h.logger.Error("Failed to update stock", zap.Int("product_id", item.ProductID), zap.Error(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
			return
		}
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		h.logger.Error("Failed to commit transaction", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	h.logger.Info("Order created successfully", zap.Int64("order_id", orderID), zap.Any("user_id", userID))

	// Return the created order
	c.JSON(http.StatusCreated, gin.H{"order_id": orderID, "total": total})
}

// getOrderItems fetches items for an order
func (h *OrderHandler) getOrderItems(orderID int64) ([]OrderItem, error) {
	query := `
		SELECT oi.id, oi.order_id, oi.product_id, oi.qty, oi.price_each,
		       p.title, p.slug, p.price as current_price
		FROM order_items oi
		LEFT JOIN products p ON oi.product_id = p.id
		WHERE oi.order_id = $1
		ORDER BY oi.id
	`

	rows, err := h.db.Query(query, orderID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []OrderItem
	for rows.Next() {
		var item OrderItem
		var title, slug sql.NullString
		var currentPrice sql.NullFloat64
		
		err := rows.Scan(
			&item.ID, &item.OrderID, &item.ProductID, &item.Qty, &item.PriceEach,
			&title, &slug, &currentPrice,
		)
		if err != nil {
			return nil, err
		}

		// Add product info if available
		if title.Valid {
			item.Product = &Product{
				ID:    item.ProductID,
				Title: title.String,
				Slug:  slug.String,
				Price: currentPrice.Float64,
			}
		}

		items = append(items, item)
	}

	return items, nil
}

// getPayment fetches payment info for an order
func (h *OrderHandler) getPayment(orderID int64) (*Payment, error) {
	var p Payment
	var rawJSON []byte
	
	query := `
		SELECT id, order_id, provider, provider_ref, status, amount, currency, raw_webhook_json, created_at
		FROM payments
		WHERE order_id = $1
	`

	err := h.db.QueryRow(query, orderID).Scan(
		&p.ID, &p.OrderID, &p.Provider, &p.ProviderRef, &p.Status, &p.Amount, &p.Currency, &rawJSON, &p.CreatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	// Parse raw webhook JSON
	if rawJSON != nil {
		if err := json.Unmarshal(rawJSON, &p.RawWebhookJSON); err != nil {
			// Log warning but don't fail
		}
	}

	return &p, nil
}
