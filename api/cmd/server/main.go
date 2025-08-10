package main

import (
	"log"

	"finspeed/api/internal/config"
	"finspeed/api/internal/database"
	"finspeed/api/internal/logger"
	"finspeed/api/internal/server"
	"go.uber.org/zap"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize logger
	zapLogger, err := logger.New(cfg.Environment, cfg.LogLevel)
	if err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}
	defer zapLogger.Sync()

	zapLogger.Info("Starting Finspeed API server")

	// Initialize database
	db, err := database.New(cfg.DatabaseURL, zapLogger)
	if err != nil {
		zapLogger.Fatal("Failed to initialize database", zap.Error(err))
	}
	defer db.Close()

	// Run database migrations
	if err := db.RunMigrations(cfg.MigrationsPath); err != nil {
		zapLogger.Fatal("Failed to run database migrations", zap.Error(err))
	}

	// Initialize and start server
	srv := server.New(cfg, db, zapLogger)
	if err := srv.Start(); err != nil {
		zapLogger.Fatal("Server failed to start", zap.Error(err))
	}
}
