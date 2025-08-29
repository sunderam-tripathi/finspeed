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
	"finspeed/api/internal/storage"
)

type Server struct {
	config *config.Config
	db     *database.DB
	logger *zap.Logger
	router *gin.Engine
}

func New(cfg *config.Config, db *database.DB, logger *zap.Logger) *Server {
	logger.Info("[SERVER] Creating new server instance...")

	// Set Gin mode based on environment
	if cfg.IsProduction() {
		gin.SetMode(gin.ReleaseMode)
		logger.Info("[SERVER] Gin mode set to 'release'.")
	} else {
		gin.SetMode(gin.DebugMode)
		logger.Info("[SERVER] Gin mode set to 'debug'.")
	}

	router := gin.New()
	logger.Info("[SERVER] Gin router initialized.")

	// Add middleware
	router.Use(middleware.Logger(logger))
	router.Use(middleware.Recovery(logger))
	router.Use(middleware.CORS())
	logger.Info("[SERVER] Core middleware (Logger, Recovery, CORS) added.")

	s := &Server{
		config: cfg,
		db:     db,
		logger: logger,
		router: router,
	}
	logger.Info("[SERVER] Server struct created.")

	s.SetupRoutes()

	logger.Info("[SERVER] New server instance created and configured successfully.")
	return s
}

func (s *Server) SetupRoutes() {
	s.logger.Info("[ROUTES] Starting route configuration...")

	// Initialize handlers
	healthHandler := handlers.NewHealthHandler(s.db, s.logger)
	authHandler := handlers.NewAuthHandler(s.db, s.logger, s.config)

	// Initialize storage backend
	var store storage.Storage
	if s.config.StorageBackend == "gcs" {
		st, err := storage.NewGCS(context.Background(), s.config.GCSBucketName, s.config.GCSBaseURL, s.logger)
		if err != nil {
			s.logger.Fatal("[STORAGE] Failed to initialize GCS storage", zap.Error(err))
		}
		store = st
		s.logger.Info("[STORAGE] Using GCS storage backend", zap.String("bucket", s.config.GCSBucketName))
	} else {
		store = storage.NewLocal("./uploads", "/api/v1/uploads")
		s.logger.Info("[STORAGE] Using local storage backend", zap.String("root", "./uploads"))
	}

	productHandler := handlers.NewProductHandler(s.db, s.logger, store)
	categoryHandler := handlers.NewCategoryHandler(s.db, s.logger)
	cartHandler := handlers.NewCartHandler(s.db, s.logger)
	orderHandler := handlers.NewOrderHandler(s.db, s.logger)
	paymentHandler := handlers.NewPaymentHandler(s.db, s.logger, s.config)
	s.logger.Info("[ROUTES] All handlers initialized.")

	// Health check routes
	s.router.GET("/healthz", healthHandler.HealthCheck)
	s.router.GET("/readyz", healthHandler.ReadinessCheck)
	s.logger.Info("[ROUTES] Health check routes (/healthz, /readyz) configured.")

	// API v1 routes
	v1 := s.router.Group("/api/v1")
	s.logger.Info("[ROUTES] Configured API v1 group.")
	{
		// Health check routes under API v1 (for LB/Gateway path-based routing)
		v1.GET("/healthz", healthHandler.HealthCheck)
		v1.GET("/readyz", healthHandler.ReadinessCheck)
		s.logger.Info("[ROUTES] API v1 health routes configured.")

		// Static files for uploaded content (local dev only)
		if s.config.StorageBackend == "local" {
			// Serves files under ./uploads at /api/v1/uploads
			v1.Static("/uploads", "./uploads")
		}

		// Auth routes (public)
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
		}
		s.logger.Info("[ROUTES] Public auth routes configured.")

		// Public product routes
		v1.GET("/products", productHandler.GetProducts)
		v1.GET("/products/:slug", productHandler.GetProduct)
		s.logger.Info("[ROUTES] Public product routes configured.")

		// Public category routes
		v1.GET("/categories", categoryHandler.GetCategories)
		v1.GET("/categories/:slug", categoryHandler.GetCategory)
		s.logger.Info("[ROUTES] Public category routes configured.")

		// Cart routes (public for session-based cart)
		cart := v1.Group("/cart")
		{
			cart.GET("", cartHandler.GetCart)
			cart.POST("/items", cartHandler.AddToCart)
			cart.PUT("/items/:product_id", cartHandler.UpdateCartItem)
			cart.DELETE("/items/:product_id", cartHandler.RemoveFromCart)
			cart.DELETE("", cartHandler.ClearCart)
		}
		s.logger.Info("[ROUTES] Cart routes configured.")

		        // Public payments webhook (Razorpay)
        v1.POST("/payments/razorpay/webhook", paymentHandler.RazorpayWebhook)

		// Protected routes (require authentication)
		protected := v1.Group("/")
		protected.Use(middleware.AuthMiddleware(s.config, s.logger))
		{
			// Order routes
			protected.GET("/orders", orderHandler.GetOrders)
			protected.GET("/orders/:id", orderHandler.GetOrder)
			protected.POST("/orders", orderHandler.CreateOrder)

			            // Payments routes (Razorpay)
            protected.POST("/payments/razorpay/order", paymentHandler.CreateRazorpayOrder)
            protected.POST("/payments/razorpay/verify", paymentHandler.VerifyRazorpayPayment)
		}
		s.logger.Info("[ROUTES] Protected (order) routes configured.")

		// Admin routes (require admin role)
		admin := v1.Group("/admin")
		admin.Use(middleware.AuthMiddleware(s.config, s.logger))
		admin.Use(middleware.AdminMiddleware())
		{
			// Admin product management
			admin.POST("/products", productHandler.CreateProduct)
			admin.PUT("/products/:id", productHandler.UpdateProduct)
			admin.DELETE("/products/:id", productHandler.DeleteProduct)
			// Product image management
			admin.POST("/products/:id/images", productHandler.UploadProductImage)
			admin.DELETE("/products/:id/images/:image_id", productHandler.DeleteProductImage)
			admin.PUT("/products/:id/images/:image_id/primary", productHandler.SetPrimaryProductImage)
			
			// Admin category management
			admin.POST("/categories", categoryHandler.CreateCategory)
			admin.PUT("/categories/:id", categoryHandler.UpdateCategory)
			admin.DELETE("/categories/:id", categoryHandler.DeleteCategory)

			// Admin user management
			admin.GET("/users", authHandler.GetUsers)
			admin.GET("/users/:id", authHandler.GetUser)
			admin.PUT("/users/:id", authHandler.UpdateUser)
			admin.DELETE("/users/:id", authHandler.DeleteUser)
		}
		s.logger.Info("[ROUTES] Admin routes configured.")
	}

	s.logger.Info("[ROUTES] All routes configured successfully.")
}

func (s *Server) Start() error {
	s.logger.Info("[SERVER_START] Configuring HTTP server...")

	// Create HTTP server
	srv := &http.Server{
		Addr:         ":" + s.config.Port,
		Handler:      s.router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}
	s.logger.Info("[SERVER_START] HTTP server configured.")

	// Start server in a goroutine
	go func() {
		s.logger.Info("[SERVER_START] Starting HTTP server...", zap.String("address", srv.Addr))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			s.logger.Fatal("[SERVER_FATAL] Failed to start HTTP server", zap.Error(err))
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	s.logger.Info("[SERVER_START] Waiting for shutdown signal...")
	<-quit

	s.logger.Info("[SERVER_SHUTDOWN] Received shutdown signal. Shutting down server...")

	// Give outstanding requests 30 seconds to complete
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		s.logger.Error("[SERVER_SHUTDOWN] Server forced to shutdown due to error", zap.Error(err))
		return err
	}

	s.logger.Info("[SERVER_SHUTDOWN] Server exited gracefully.")
	return nil
}
