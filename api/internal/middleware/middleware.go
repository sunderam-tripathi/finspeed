package middleware

import (
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// Logger creates a Gin middleware for structured logging
func Logger(logger *zap.Logger) gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		logger.Info("HTTP Request",
			zap.String("method", param.Method),
			zap.String("path", param.Path),
			zap.Int("status", param.StatusCode),
			zap.Duration("latency", param.Latency),
			zap.String("client_ip", param.ClientIP),
			zap.String("user_agent", param.Request.UserAgent()),
		)
		return ""
	})
}

// CORS middleware for handling Cross-Origin Resource Sharing
func CORS() gin.HandlerFunc {
	// Determine allowed origins. Prefer CORS_ALLOWED_ORIGINS (comma-separated),
	// else FRONTEND_BASE_URL, else default to http://localhost:3000
	allowed := os.Getenv("CORS_ALLOWED_ORIGINS")
	var allowedOrigins []string
	if strings.TrimSpace(allowed) != "" {
		for _, o := range strings.Split(allowed, ",") {
			o = strings.TrimSpace(o)
			if o != "" {
				allowedOrigins = append(allowedOrigins, o)
			}
		}
	}
	if len(allowedOrigins) == 0 {
		fb := strings.TrimSpace(os.Getenv("FRONTEND_BASE_URL"))
		if fb == "" {
			fb = "http://localhost:3000"
		}
		allowedOrigins = []string{fb}
	}

	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		// Reflect the request Origin if allowed to enable credentials
		if origin != "" {
			for _, ao := range allowedOrigins {
				if origin == ao {
					c.Header("Access-Control-Allow-Origin", origin)
					c.Header("Vary", "Origin")
					break
				}
			}
		}

		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

// RequestID middleware adds a unique request ID to each request
func RequestID() gin.HandlerFunc {
	return gin.CustomRecovery(func(c *gin.Context, recovered interface{}) {
		c.JSON(500, gin.H{
			"error": "Internal server error",
		})
	})
}

// Recovery middleware with structured logging
func Recovery(logger *zap.Logger) gin.HandlerFunc {
	return gin.CustomRecovery(func(c *gin.Context, recovered interface{}) {
		logger.Error("Panic recovered",
			zap.Any("error", recovered),
			zap.String("path", c.Request.URL.Path),
			zap.String("method", c.Request.Method),
		)
		c.JSON(500, gin.H{
			"error": "Internal server error",
		})
	})
}
