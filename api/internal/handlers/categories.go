package handlers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"finspeed/api/internal/database"
)

type CategoryHandler struct {
	db     *database.DB
	logger *zap.Logger
}

type Category struct {
	ID       int64  `json:"id"`
	Name     string `json:"name"`
	Slug     string `json:"slug"`
	ParentID *int64 `json:"parent_id,omitempty"`
}

type CreateCategoryRequest struct {
	Name     string `json:"name" binding:"required"`
	Slug     string `json:"slug" binding:"required"`
	ParentID *int64 `json:"parent_id,omitempty"`
}

func NewCategoryHandler(db *database.DB, logger *zap.Logger) *CategoryHandler {
	return &CategoryHandler{
		db:     db,
		logger: logger,
	}
}

// GetCategories handles GET /api/v1/categories
func (h *CategoryHandler) GetCategories(c *gin.Context) {
	query := `
		SELECT id, name, slug, parent_id
		FROM categories
		ORDER BY name ASC
	`

	rows, err := h.db.Query(query)
	if err != nil {
		h.logger.Error("Failed to fetch categories", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}
	defer rows.Close()

	var categories []Category
	for rows.Next() {
		var cat Category
		err := rows.Scan(&cat.ID, &cat.Name, &cat.Slug, &cat.ParentID)
		if err != nil {
			h.logger.Error("Failed to scan category", zap.Error(err))
			continue
		}
		categories = append(categories, cat)
	}

	c.JSON(http.StatusOK, gin.H{
		"categories": categories,
		"total":      len(categories),
	})
}

// GetCategory handles GET /api/v1/categories/:slug
func (h *CategoryHandler) GetCategory(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Category slug is required"})
		return
	}

	var cat Category
	query := `
		SELECT id, name, slug, parent_id
		FROM categories
		WHERE slug = $1
	`

	err := h.db.QueryRow(query, slug).Scan(&cat.ID, &cat.Name, &cat.Slug, &cat.ParentID)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
			return
		}
		h.logger.Error("Failed to fetch category", zap.String("slug", slug), zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch category"})
		return
	}

	c.JSON(http.StatusOK, cat)
}

// CreateCategory handles POST /api/v1/admin/categories
func (h *CategoryHandler) CreateCategory(c *gin.Context) {
	var req CreateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.Warn("Invalid create category request", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	var categoryID int64
	query := `
		INSERT INTO categories (name, slug, parent_id)
		VALUES ($1, $2, $3)
		RETURNING id
	`

	err := h.db.QueryRow(query, req.Name, req.Slug, req.ParentID).Scan(&categoryID)
	if err != nil {
		h.logger.Error("Failed to create category", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create category"})
		return
	}

	h.logger.Info("Category created successfully", zap.Int64("category_id", categoryID))

	// Return the created category
	category := Category{
		ID:       categoryID,
		Name:     req.Name,
		Slug:     req.Slug,
		ParentID: req.ParentID,
	}

	c.JSON(http.StatusCreated, category)
}
