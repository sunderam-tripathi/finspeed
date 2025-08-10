package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"finspeed/api/internal/database"
)

type HealthHandler struct {
	db     *database.DB
	logger *zap.Logger
}

func NewHealthHandler(db *database.DB, logger *zap.Logger) *HealthHandler {
	return &HealthHandler{
		db:     db,
		logger: logger,
	}
}

// HealthCheck handles the /healthz endpoint
func (h *HealthHandler) HealthCheck(c *gin.Context) {
	// Check database connectivity
	if err := h.db.HealthCheck(); err != nil {
		h.logger.Error("Health check failed", zap.Error(err))
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status": "unhealthy",
			"error":  "database connection failed",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":    "healthy",
		"timestamp": "2025-08-08T09:30:45Z",
		"version":   "1.0.0",
		"database":  "connected",
	})
}

// ReadinessCheck handles the /readyz endpoint
func (h *HealthHandler) ReadinessCheck(c *gin.Context) {
	// More comprehensive readiness check
	if err := h.db.HealthCheck(); err != nil {
		h.logger.Error("Readiness check failed", zap.Error(err))
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status": "not ready",
			"error":  "database not ready",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":   "ready",
		"database": "ready",
	})
}
