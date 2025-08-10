package handlers

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"finspeed/api/internal/database"
)

type ProductHandler struct {
	db     *database.DB
	logger *zap.Logger
}

type Product struct {
	ID              int64                  `json:"id"`
	Title           string                 `json:"title"`
	Slug            string                 `json:"slug"`
	Price           float64                `json:"price"`
	Currency        string                 `json:"currency"`
	SKU             *string                `json:"sku,omitempty"`
	HSN             *string                `json:"hsn,omitempty"`
	StockQty        int                    `json:"stock_qty"`
	CategoryID      *int64                 `json:"category_id,omitempty"`
	SpecsJSON       map[string]interface{} `json:"specs,omitempty"`
	WarrantyMonths  *int                   `json:"warranty_months,omitempty"`
	CreatedAt       string                 `json:"created_at"`
	UpdatedAt       *string                `json:"updated_at,omitempty"`
	Images          []ProductImage         `json:"images,omitempty"`
	Category        *Category              `json:"category,omitempty"`
}

type ProductImage struct {
	ID        int64   `json:"id"`
	ProductID int64   `json:"product_id"`
	URL       string  `json:"url"`
	Alt       *string `json:"alt,omitempty"`
	IsPrimary bool    `json:"is_primary"`
}

type CreateProductRequest struct {
	Title          string                 `json:"title" binding:"required"`
	Slug           string                 `json:"slug" binding:"required"`
	Price          float64                `json:"price" binding:"required,gt=0"`
	Currency       string                 `json:"currency"`
	SKU            *string                `json:"sku,omitempty"`
	HSN            *string                `json:"hsn,omitempty"`
	StockQty       int                    `json:"stock_qty" binding:"gte=0"`
	CategoryID     *int64                 `json:"category_id,omitempty"`
	SpecsJSON      map[string]interface{} `json:"specs,omitempty"`
	WarrantyMonths *int                   `json:"warranty_months,omitempty"`
}

type ProductsResponse struct {
	Products []Product `json:"products"`
	Total    int       `json:"total"`
	Page     int       `json:"page"`
	Limit    int       `json:"limit"`
}

func NewProductHandler(db *database.DB, logger *zap.Logger) *ProductHandler {
	return &ProductHandler{
		db:     db,
		logger: logger,
	}
}

// GetProducts handles GET /api/v1/products
func (h *ProductHandler) GetProducts(c *gin.Context) {
	// Parse query parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	categoryID := c.Query("category_id")
	
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}
	
	offset := (page - 1) * limit

	// Build query
	baseQuery := `
		SELECT p.id, p.title, p.slug, p.price, p.currency, p.sku, p.hsn, 
		       p.stock_qty, p.category_id, p.specs_json, p.warranty_months, 
		       p.created_at, p.updated_at,
		       c.name as category_name, c.slug as category_slug
		FROM products p
		LEFT JOIN categories c ON p.category_id = c.id
	`
	
	countQuery := "SELECT COUNT(*) FROM products p"
	args := []interface{}{}
	
	if categoryID != "" {
		baseQuery += " WHERE p.category_id = $1"
		countQuery += " WHERE p.category_id = $1"
		args = append(args, categoryID)
	}
	
	baseQuery += " ORDER BY p.created_at DESC LIMIT $" + strconv.Itoa(len(args)+1) + " OFFSET $" + strconv.Itoa(len(args)+2)
	args = append(args, limit, offset)

	// Get total count
	var total int
	countArgs := args[:len(args)-2] // Remove limit and offset for count
	if err := h.db.QueryRow(countQuery, countArgs...).Scan(&total); err != nil {
		h.logger.Error("Failed to get products count", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}

	// Get products
	rows, err := h.db.Query(baseQuery, args...)
	if err != nil {
		h.logger.Error("Failed to fetch products", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}
	defer rows.Close()

	var products []Product
	for rows.Next() {
		var p Product
		var categoryName, categorySlug sql.NullString
		
		err := rows.Scan(
			&p.ID, &p.Title, &p.Slug, &p.Price, &p.Currency, &p.SKU, &p.HSN,
			&p.StockQty, &p.CategoryID, &p.SpecsJSON, &p.WarrantyMonths,
			&p.CreatedAt, &p.UpdatedAt, &categoryName, &categorySlug,
		)
		if err != nil {
			h.logger.Error("Failed to scan product", zap.Error(err))
			continue
		}

		// Add category if present
		if categoryName.Valid && p.CategoryID != nil {
			p.Category = &Category{
				ID:   *p.CategoryID,
				Name: categoryName.String,
				Slug: categorySlug.String,
			}
		}

		products = append(products, p)
	}

	// Get images for each product
	for i := range products {
		images, err := h.getProductImages(products[i].ID)
		if err != nil {
			h.logger.Warn("Failed to fetch product images", zap.Int64("product_id", products[i].ID), zap.Error(err))
		} else {
			products[i].Images = images
		}
	}

	c.JSON(http.StatusOK, ProductsResponse{
		Products: products,
		Total:    total,
		Page:     page,
		Limit:    limit,
	})
}

// GetProduct handles GET /api/v1/products/:slug
func (h *ProductHandler) GetProduct(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product slug is required"})
		return
	}

	var p Product
	var categoryName, categorySlug sql.NullString
	
	query := `
		SELECT p.id, p.title, p.slug, p.price, p.currency, p.sku, p.hsn, 
		       p.stock_qty, p.category_id, p.specs_json, p.warranty_months, 
		       p.created_at, p.updated_at,
		       c.name as category_name, c.slug as category_slug
		FROM products p
		LEFT JOIN categories c ON p.category_id = c.id
		WHERE p.slug = $1
	`

	err := h.db.QueryRow(query, slug).Scan(
		&p.ID, &p.Title, &p.Slug, &p.Price, &p.Currency, &p.SKU, &p.HSN,
		&p.StockQty, &p.CategoryID, &p.SpecsJSON, &p.WarrantyMonths,
		&p.CreatedAt, &p.UpdatedAt, &categoryName, &categorySlug,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
			return
		}
		h.logger.Error("Failed to fetch product", zap.String("slug", slug), zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch product"})
		return
	}

	// Add category if present
	if categoryName.Valid && p.CategoryID != nil {
		p.Category = &Category{
			ID:   *p.CategoryID,
			Name: categoryName.String,
			Slug: categorySlug.String,
		}
	}

	// Get product images
	images, err := h.getProductImages(p.ID)
	if err != nil {
		h.logger.Warn("Failed to fetch product images", zap.Int64("product_id", p.ID), zap.Error(err))
	} else {
		p.Images = images
	}

	c.JSON(http.StatusOK, p)
}

// CreateProduct handles POST /api/v1/admin/products
func (h *ProductHandler) CreateProduct(c *gin.Context) {
	var req CreateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.Warn("Invalid create product request", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Set default currency if not provided
	if req.Currency == "" {
		req.Currency = "INR"
	}

	var productID int64
	query := `
		INSERT INTO products (title, slug, price, currency, sku, hsn, stock_qty, category_id, specs_json, warranty_months)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id
	`

	err := h.db.QueryRow(
		query,
		req.Title, req.Slug, req.Price, req.Currency, req.SKU, req.HSN,
		req.StockQty, req.CategoryID, req.SpecsJSON, req.WarrantyMonths,
	).Scan(&productID)

	if err != nil {
		h.logger.Error("Failed to create product", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}

	h.logger.Info("Product created successfully", zap.Int64("product_id", productID))

	// Return the created product
	h.GetProduct(c)
}

// getProductImages fetches images for a product
func (h *ProductHandler) getProductImages(productID int64) ([]ProductImage, error) {
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
