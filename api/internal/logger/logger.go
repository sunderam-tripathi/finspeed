package logger

import (
	"go.uber.org/zap"
)

func New(environment string, logLevel string) (*zap.Logger, error) {
	var config zap.Config

	if environment == "production" {
		config = zap.NewProductionConfig()
	} else {
		config = zap.NewDevelopmentConfig()
	}

	// Set log level
	level, err := zap.ParseAtomicLevel(logLevel)
	if err != nil {
		return nil, err
	}
	config.Level = level

	logger, err := config.Build()
	if err != nil {
		return nil, err
	}

	return logger, nil
}
