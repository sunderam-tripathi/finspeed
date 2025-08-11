package main

import (
	"log"
	"os"

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

	// Initialize database
	db, err := database.New(cfg.DatabaseURL, zapLogger)
	if err != nil {
		zapLogger.Fatal("Failed to initialize database", zap.Error(err))
	}
	defer db.Close()

	// Check for command-line arguments to determine run mode
	if len(os.Args) > 1 && os.Args[1] == "migrate" {
		zapLogger.Info("Running database migrations")
		if err := db.RunMigrations(cfg.MigrationsPath); err != nil {
			zapLogger.Fatal("Failed to run database migrations", zap.Error(err))
		}
		zapLogger.Info("Database migrations completed successfully")
		return // Exit after running migrations
	}

	// Default to starting the server
	zapLogger.Info("Starting Finspeed API server")
	srv := server.New(cfg, db, zapLogger)
	if err := srv.Start(); err != nil {
		zapLogger.Fatal("Server failed to start", zap.Error(err))
	}
}
