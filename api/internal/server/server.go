package server

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"finspeed/api/internal/config"
	"finspeed/api/internal/database"
	"finspeed/api/internal/handlers"
	"finspeed/api/internal/middleware"
)

type Server struct {
	config *config.Config
	db     *database.DB
	logger *zap.Logger
	router *gin.Engine
}

func New(cfg *config.Config, db *database.DB, logger *zap.Logger) *Server {
	// Set Gin mode based on environment
	if cfg.IsProduction() {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}

	router := gin.New()

	// Add middleware
	router.Use(middleware.Logger(logger))
	router.Use(middleware.Recovery(logger))
	router.Use(middleware.CORS())

	return &Server{
		config: cfg,
		db:     db,
		logger: logger,
		router: router,
	}
}

func (s *Server) SetupRoutes() {
	// Initialize handlers
	healthHandler := handlers.NewHealthHandler(s.db, s.logger)

	// Health check routes
	s.router.GET("/healthz", healthHandler.HealthCheck)
	s.router.GET("/readyz", healthHandler.ReadinessCheck)

	// API v1 routes
	v1 := s.router.Group("/api/v1")
	{
		// Products routes (placeholder)
		v1.GET("/products", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "Products endpoint - coming soon",
				"data":    []interface{}{},
			})
		})

		// Categories routes (placeholder)
		v1.GET("/categories", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "Categories endpoint - coming soon",
				"data":    []interface{}{},
			})
		})

		// Cart routes (placeholder)
		v1.GET("/cart", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "Cart endpoint - coming soon",
				"data":    gin.H{},
			})
		})
	}

	s.logger.Info("Routes configured successfully")
}

func (s *Server) Start() error {
	s.SetupRoutes()

	// Create HTTP server
	srv := &http.Server{
		Addr:         ":" + s.config.Port,
		Handler:      s.router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in a goroutine
	go func() {
		s.logger.Info("Starting server", zap.String("port", s.config.Port))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			s.logger.Fatal("Failed to start server", zap.Error(err))
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	s.logger.Info("Shutting down server...")

	// Give outstanding requests 30 seconds to complete
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		s.logger.Error("Server forced to shutdown", zap.Error(err))
		return err
	}

	s.logger.Info("Server exited")
	return nil
}
