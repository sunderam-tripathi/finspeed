package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Port           string
	DatabaseURL    string
	Environment    string
	LogLevel       string
	MigrationsPath string
}

func Load() (*Config, error) {
	// Load .env.local file if it exists
	if err := godotenv.Load(".env.local"); err != nil {
		// It's okay if the file doesn't exist, we'll use environment variables
		fmt.Printf("Warning: .env.local file not found, using environment variables\n")
	}

	config := &Config{
		Port:           getEnvWithDefault("PORT", "8080"),
		DatabaseURL:    getEnvWithDefault("DATABASE_URL", "postgres://finspeed:finspeed@localhost:5432/finspeed?sslmode=disable"),
		Environment:    getEnvWithDefault("ENVIRONMENT", "development"),
		LogLevel:       getEnvWithDefault("LOG_LEVEL", "info"),
		MigrationsPath: getEnvWithDefault("MIGRATIONS_PATH", "file://db/migrations"),
	}

	if err := config.validate(); err != nil {
		return nil, fmt.Errorf("config validation failed: %w", err)
	}

	return config, nil
}

func (c *Config) validate() error {
	if c.DatabaseURL == "" {
		return fmt.Errorf("DATABASE_URL is required")
	}
	if c.Port == "" {
		return fmt.Errorf("PORT is required")
	}
	return nil
}

func (c *Config) IsDevelopment() bool {
	return c.Environment == "development"
}

func (c *Config) IsProduction() bool {
	return c.Environment == "production"
}

func getEnvWithDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}
