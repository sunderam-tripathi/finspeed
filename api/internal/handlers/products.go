package handlers

import (
	"database/sql"
	"net/http"
	"strconv"
	"strings"

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
	search := c.Query("search") // New search parameter

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
	whereClauses := []string{}
	argCount := 1

	if categoryID != "" {
		whereClauses = append(whereClauses, "p.category_id = $"+strconv.Itoa(argCount))
		args = append(args, categoryID)
		argCount++
	}

	if search != "" {
		searchClause := "(p.title ILIKE $" + strconv.Itoa(argCount) + " OR p.slug ILIKE $" + strconv.Itoa(argCount) + " OR p.sku ILIKE $" + strconv.Itoa(argCount) + ")"
		whereClauses = append(whereClauses, searchClause)
		args = append(args, "%"+search+"%")
		argCount++
	}
	
	if len(whereClauses) > 0 {
		whereStatement := " WHERE " + strings.Join(whereClauses, " AND ")
		baseQuery += whereStatement
		countQuery += whereStatement
	}
	
	// Get total count first
	var total int
	if err := h.db.QueryRow(countQuery, args...).Scan(&total); err != nil {
		h.logger.Error("Failed to get products count", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}

	// Add ordering, limit and offset for the main query
	baseQuery += " ORDER BY p.created_at DESC LIMIT $" + strconv.Itoa(argCount) + " OFFSET $" + strconv.Itoa(argCount+1)
	args = append(args, limit, offset)

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

type UpdateProductRequest struct {
	Title          *string                `json:"title,omitempty"`
	Slug           *string                `json:"slug,omitempty"`
	Price          *float64               `json:"price,omitempty"`
	Currency       *string                `json:"currency,omitempty"`
	SKU            *string                `json:"sku,omitempty"`
	HSN            *string                `json:"hsn,omitempty"`
	StockQty       *int                   `json:"stock_qty,omitempty"`
	CategoryID     *int64                 `json:"category_id,omitempty"`
	SpecsJSON      map[string]interface{} `json:"specs,omitempty"`
	WarrantyMonths *int                   `json:"warranty_months,omitempty"`
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

// UpdateProduct handles PUT /api/v1/admin/products/:id
func (h *ProductHandler) UpdateProduct(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	var req UpdateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.Warn("Invalid update product request", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Dynamically build update query
	query := "UPDATE products SET "
	args := []interface{}{}
	argId := 1

	if req.Title != nil {
		query += "title = $" + strconv.Itoa(argId) + ", "
		args = append(args, *req.Title)
		argId++
	}
	if req.Slug != nil {
		query += "slug = $" + strconv.Itoa(argId) + ", "
		args = append(args, *req.Slug)
		argId++
	}
	if req.Price != nil {
		query += "price = $" + strconv.Itoa(argId) + ", "
		args = append(args, *req.Price)
		argId++
	}
	if req.Currency != nil {
		query += "currency = $" + strconv.Itoa(argId) + ", "
		args = append(args, *req.Currency)
		argId++
	}
	if req.SKU != nil {
		query += "sku = $" + strconv.Itoa(argId) + ", "
		args = append(args, *req.SKU)
		argId++
	}
	if req.HSN != nil {
		query += "hsn = $" + strconv.Itoa(argId) + ", "
		args = append(args, *req.HSN)
		argId++
	}
	if req.StockQty != nil {
		query += "stock_qty = $" + strconv.Itoa(argId) + ", "
		args = append(args, *req.StockQty)
		argId++
	}
	if req.CategoryID != nil {
		query += "category_id = $" + strconv.Itoa(argId) + ", "
		args = append(args, *req.CategoryID)
		argId++
	}
	if req.SpecsJSON != nil {
		query += "specs_json = $" + strconv.Itoa(argId) + ", "
		args = append(args, req.SpecsJSON)
		argId++
	}
	if req.WarrantyMonths != nil {
		query += "warranty_months = $" + strconv.Itoa(argId) + ", "
		args = append(args, *req.WarrantyMonths)
		argId++
	}

	if len(args) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No fields to update"})
		return
	}

	query += "updated_at = NOW() WHERE id = $" + strconv.Itoa(argId)
	args = append(args, id)

	// Execute query
	result, err := h.db.Exec(query, args...)
	if err != nil {
		h.logger.Error("Failed to update product", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		h.logger.Error("Failed to get rows affected", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	h.logger.Info("Product updated successfully", zap.Int64("product_id", id))
	c.JSON(http.StatusOK, gin.H{"message": "Product updated successfully"})
}

// DeleteProduct handles DELETE /api/v1/admin/products/:id
func (h *ProductHandler) DeleteProduct(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	query := "DELETE FROM products WHERE id = $1"
	result, err := h.db.Exec(query, id)
	if err != nil {
		h.logger.Error("Failed to delete product", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product"})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		h.logger.Error("Failed to get rows affected", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product"})
		return
	}

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	h.logger.Info("Product deleted successfully", zap.Int64("product_id", id))
	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
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
