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

// Trigger CI for final validation
func main() {
	log.Println("[BOOT] Starting application...")

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("[BOOT_FATAL] Failed to load config: %v", err)
	}
	log.Println("[BOOT] Configuration loaded.")

	// Initialize logger
	zapLogger, err := logger.New(cfg.Environment, cfg.LogLevel)
	if err != nil {
		log.Fatalf("[BOOT_FATAL] Failed to initialize logger: %v", err)
	}
	defer zapLogger.Sync()
	zapLogger.Info("[BOOT] Logger initialized.")

	// Initialize database
	db, err := database.New(cfg.DatabaseURL, zapLogger)
	if err != nil {
		zapLogger.Fatal("[BOOT_FATAL] Failed to initialize database", zap.Error(err))
	}
	defer db.Close()
	zapLogger.Info("[BOOT] Database connection established.")

	// Check for command-line arguments to determine run mode
	if len(os.Args) > 1 && os.Args[1] == "migrate" {
		zapLogger.Info("[BOOT] Running in migration mode.")
		if err := db.RunMigrations(cfg.MigrationsPath); err != nil {
			zapLogger.Fatal("[BOOT_FATAL] Failed to run database migrations", zap.Error(err))
		}
		zapLogger.Info("[BOOT] Database migrations completed successfully.")
		return // Exit after running migrations
	}

	// Default to starting the server
	zapLogger.Info("[BOOT] Running in server mode.")
	srv := server.New(cfg, db, zapLogger)
	zapLogger.Info("[BOOT] Server instance created.")

	if err := srv.Start(); err != nil {
		zapLogger.Fatal("[BOOT_FATAL] Server failed to start", zap.Error(err))
	}
	zapLogger.Info("[BOOT] Server has shut down gracefully.")
}
