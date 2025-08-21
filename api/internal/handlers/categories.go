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

type UpdateCategoryRequest struct {
	Name     *string `json:"name,omitempty"`
	Slug     *string `json:"slug,omitempty"`
	ParentID *int64  `json:"parent_id,omitempty"`
}

type CategoriesResponse struct {
	Categories []Category `json:"categories"`
	Total      int        `json:"total"`
	Page       int        `json:"page"`
	Limit      int        `json:"limit"`
}

func NewCategoryHandler(db *database.DB, logger *zap.Logger) *CategoryHandler {
	return &CategoryHandler{
		db:     db,
		logger: logger,
	}
}

// GetCategories handles GET /api/v1/categories
func (h *CategoryHandler) GetCategories(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	search := c.Query("search")

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	offset := (page - 1) * limit

	baseQuery := "SELECT id, name, slug, parent_id FROM categories"
	countQuery := "SELECT COUNT(*) FROM categories"
	args := []interface{}{}
	whereClauses := []string{}
	argCount := 1

	if search != "" {
		whereClauses = append(whereClauses, "(name ILIKE $" + strconv.Itoa(argCount) + " OR slug ILIKE $" + strconv.Itoa(argCount) + ")")
		args = append(args, "%"+search+"%")
		argCount++
	}

	if len(whereClauses) > 0 {
		whereStatement := " WHERE " + strings.Join(whereClauses, " AND ")
		baseQuery += whereStatement
		countQuery += whereStatement
	}

	var total int
	if err := h.db.QueryRow(countQuery, args...).Scan(&total); err != nil {
		h.logger.Error("Failed to get categories count", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}

	baseQuery += " ORDER BY name ASC LIMIT $" + strconv.Itoa(argCount) + " OFFSET $" + strconv.Itoa(argCount+1)
	args = append(args, limit, offset)

	rows, err := h.db.Query(baseQuery, args...)
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

	c.JSON(http.StatusOK, CategoriesResponse{
		Categories: categories,
		Total:      total,
		Page:       page,
		Limit:      limit,
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

// UpdateCategory handles PUT /api/v1/admin/categories/:id
func (h *CategoryHandler) UpdateCategory(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	var req UpdateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.Warn("Invalid update category request", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	query := "UPDATE categories SET "
	args := []interface{}{}
	argId := 1

	if req.Name != nil {
		query += "name = $" + strconv.Itoa(argId) + ", "
		args = append(args, *req.Name)
		argId++
	}
	if req.Slug != nil {
		query += "slug = $" + strconv.Itoa(argId) + ", "
		args = append(args, *req.Slug)
		argId++
	}
	if req.ParentID != nil {
		query += "parent_id = $" + strconv.Itoa(argId) + ", "
		args = append(args, *req.ParentID)
		argId++
	}

	if len(args) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No fields to update"})
		return
	}

	query = query[:len(query)-2] // Remove trailing comma and space
	query += " WHERE id = $" + strconv.Itoa(argId)
	args = append(args, id)

	result, err := h.db.Exec(query, args...)
	if err != nil {
		h.logger.Error("Failed to update category", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update category"})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		h.logger.Error("Failed to get rows affected", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update category"})
		return
	}

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	h.logger.Info("Category updated successfully", zap.Int64("category_id", id))
	c.JSON(http.StatusOK, gin.H{"message": "Category updated successfully"})
}

// DeleteCategory handles DELETE /api/v1/admin/categories/:id
func (h *CategoryHandler) DeleteCategory(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	query := "DELETE FROM categories WHERE id = $1"
	result, err := h.db.Exec(query, id)
	if err != nil {
		h.logger.Error("Failed to delete category", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete category"})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		h.logger.Error("Failed to get rows affected", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete category"})
		return
	}

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	h.logger.Info("Category deleted successfully", zap.Int64("category_id", id))
	c.JSON(http.StatusOK, gin.H{"message": "Category deleted successfully"})
}
