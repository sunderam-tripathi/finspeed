package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"finspeed/api/internal/database"
)

type CartHandler struct {
	db     *database.DB
	logger *zap.Logger
}

type CartItem struct {
	ProductID int     `json:"product_id"`
	Qty       int     `json:"qty"`
	Product   Product `json:"product"`
	Subtotal  float64 `json:"subtotal"`
}

type Cart struct {
	Items    []CartItem `json:"items"`
	Subtotal float64    `json:"subtotal"`
	Total    float64    `json:"total"`
	Count    int        `json:"count"`
}

type AddToCartRequest struct {
	ProductID int `json:"product_id" binding:"required"`
	Qty       int `json:"qty" binding:"required,min=1"`
}

type UpdateCartRequest struct {
	Qty int `json:"qty" binding:"required,min=0"`
}

func NewCartHandler(db *database.DB, logger *zap.Logger) *CartHandler {
	return &CartHandler{
		db:     db,
		logger: logger,
	}
}

// GetCart handles GET /api/v1/cart
func (h *CartHandler) GetCart(c *gin.Context) {
	cart := h.getCartFromSession(c)
	
	// Enrich cart with product details
	enrichedCart, err := h.enrichCart(cart)
	if err != nil {
		h.logger.Error("Failed to enrich cart", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cart"})
		return
	}

	c.JSON(http.StatusOK, enrichedCart)
}

// AddToCart handles POST /api/v1/cart/items
func (h *CartHandler) AddToCart(c *gin.Context) {
	var req AddToCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.Warn("Invalid add to cart request", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Validate product exists and has stock
	var stockQty int
	err := h.db.QueryRow("SELECT stock_qty FROM products WHERE id = $1", req.ProductID).Scan(&stockQty)
	if err != nil {
		h.logger.Error("Product not found", zap.Int("product_id", req.ProductID))
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	cart := h.getCartFromSession(c)
	
	// Check if item already exists in cart
	found := false
	for i, item := range cart {
		if item.ProductID == req.ProductID {
			newQty := item.Qty + req.Qty
			if newQty > stockQty {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock", "available": stockQty})
				return
			}
			cart[i].Qty = newQty
			found = true
			break
		}
	}

	// Add new item if not found
	if !found {
		if req.Qty > stockQty {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock", "available": stockQty})
			return
		}
		cart = append(cart, CartItem{
			ProductID: req.ProductID,
			Qty:       req.Qty,
		})
	}

	h.saveCartToSession(c, cart)

	// Return enriched cart
	enrichedCart, err := h.enrichCart(cart)
	if err != nil {
		h.logger.Error("Failed to enrich cart", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart"})
		return
	}

	c.JSON(http.StatusOK, enrichedCart)
}

// UpdateCartItem handles PUT /api/v1/cart/items/:product_id
func (h *CartHandler) UpdateCartItem(c *gin.Context) {
	productIDStr := c.Param("product_id")
	productID, err := strconv.Atoi(productIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	var req UpdateCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.Warn("Invalid update cart request", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	cart := h.getCartFromSession(c)

	// Find and update item
	found := false
	for i, item := range cart {
		if item.ProductID == productID {
			if req.Qty == 0 {
				// Remove item
				cart = append(cart[:i], cart[i+1:]...)
			} else {
				// Validate stock
				var stockQty int
				err := h.db.QueryRow("SELECT stock_qty FROM products WHERE id = $1", productID).Scan(&stockQty)
				if err != nil {
					h.logger.Error("Product not found", zap.Int("product_id", productID))
					c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
					return
				}

				if req.Qty > stockQty {
					c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock", "available": stockQty})
					return
				}

				cart[i].Qty = req.Qty
			}
			found = true
			break
		}
	}

	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found in cart"})
		return
	}

	h.saveCartToSession(c, cart)

	// Return enriched cart
	enrichedCart, err := h.enrichCart(cart)
	if err != nil {
		h.logger.Error("Failed to enrich cart", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart"})
		return
	}

	c.JSON(http.StatusOK, enrichedCart)
}

// RemoveFromCart handles DELETE /api/v1/cart/items/:product_id
func (h *CartHandler) RemoveFromCart(c *gin.Context) {
	productIDStr := c.Param("product_id")
	productID, err := strconv.Atoi(productIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	cart := h.getCartFromSession(c)

	// Find and remove item
	found := false
	for i, item := range cart {
		if item.ProductID == productID {
			cart = append(cart[:i], cart[i+1:]...)
			found = true
			break
		}
	}

	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found in cart"})
		return
	}

	h.saveCartToSession(c, cart)

	// Return enriched cart
	enrichedCart, err := h.enrichCart(cart)
	if err != nil {
		h.logger.Error("Failed to enrich cart", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart"})
		return
	}

	c.JSON(http.StatusOK, enrichedCart)
}

// ClearCart handles DELETE /api/v1/cart
func (h *CartHandler) ClearCart(c *gin.Context) {
	h.saveCartToSession(c, []CartItem{})
	
	c.JSON(http.StatusOK, Cart{
		Items:    []CartItem{},
		Subtotal: 0,
		Total:    0,
		Count:    0,
	})
}

// getCartFromSession retrieves cart from session/cookie
func (h *CartHandler) getCartFromSession(c *gin.Context) []CartItem {
	cartCookie, err := c.Cookie("cart")
	if err != nil {
		return []CartItem{}
	}

	var cart []CartItem
	if err := json.Unmarshal([]byte(cartCookie), &cart); err != nil {
		h.logger.Warn("Failed to parse cart cookie", zap.Error(err))
		return []CartItem{}
	}

	return cart
}

// saveCartToSession saves cart to session/cookie
func (h *CartHandler) saveCartToSession(c *gin.Context, cart []CartItem) {
	cartJSON, err := json.Marshal(cart)
	if err != nil {
		h.logger.Error("Failed to marshal cart", zap.Error(err))
		return
	}

	// Set cookie for 7 days
	c.SetCookie("cart", string(cartJSON), 7*24*3600, "/", "", false, true)
}

// enrichCart adds product details and calculates totals
func (h *CartHandler) enrichCart(cart []CartItem) (Cart, error) {
	if len(cart) == 0 {
		return Cart{
			Items:    []CartItem{},
			Subtotal: 0,
			Total:    0,
			Count:    0,
		}, nil
	}

	var enrichedItems []CartItem
	var subtotal float64
	var totalCount int

	for _, item := range cart {
		// Get product details
		var p Product
		var categoryName, categorySlug string
		
		query := `
			SELECT p.id, p.title, p.slug, p.price, p.currency, p.sku, p.hsn, 
			       p.stock_qty, p.category_id, p.specs_json, p.warranty_months, 
			       p.created_at, p.updated_at, COALESCE(c.name, '') as category_name, 
			       COALESCE(c.slug, '') as category_slug
			FROM products p
			LEFT JOIN categories c ON p.category_id = c.id
			WHERE p.id = $1
		`

		err := h.db.QueryRow(query, item.ProductID).Scan(
			&p.ID, &p.Title, &p.Slug, &p.Price, &p.Currency, &p.SKU, &p.HSN,
			&p.StockQty, &p.CategoryID, &p.SpecsJSON, &p.WarrantyMonths,
			&p.CreatedAt, &p.UpdatedAt, &categoryName, &categorySlug,
		)

		if err != nil {
			h.logger.Warn("Product not found in cart", zap.Int("product_id", item.ProductID))
			continue // Skip invalid products
		}

		// Add category if present
		if categoryName != "" && p.CategoryID != nil {
			p.Category = &Category{
				ID:   *p.CategoryID,
				Name: categoryName,
				Slug: categorySlug,
			}
		}

		// Get product images
		images, err := h.getProductImages(p.ID)
		if err == nil {
			p.Images = images
		}

		itemSubtotal := p.Price * float64(item.Qty)
		enrichedItem := CartItem{
			ProductID: item.ProductID,
			Qty:       item.Qty,
			Product:   p,
			Subtotal:  itemSubtotal,
		}

		enrichedItems = append(enrichedItems, enrichedItem)
		subtotal += itemSubtotal
		totalCount += item.Qty
	}

	return Cart{
		Items:    enrichedItems,
		Subtotal: subtotal,
		Total:    subtotal, // Can add shipping/tax calculation here
		Count:    totalCount,
	}, nil
}

// getProductImages fetches images for a product (reused from products handler)
func (h *CartHandler) getProductImages(productID int64) ([]ProductImage, error) {
	query := `
		SELECT id, product_id, url, alt, is_primary
		FROM product_images
		WHERE product_id = $1
		ORDER BY is_primary DESC, id ASC
	`

	rows, err := h.db.Query(query, productID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var images []ProductImage
	for rows.Next() {
		var img ProductImage
		err := rows.Scan(&img.ID, &img.ProductID, &img.URL, &img.Alt, &img.IsPrimary)
		if err != nil {
			return nil, err
		}
		images = append(images, img)
	}

	return images, nil
}
