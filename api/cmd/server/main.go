package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

// main is the entry point for the Finspeed API server.
func main() {
	// Setup Gin router
	router := gin.Default()

	// Per task 1.13, define a health check route.
	// This will be used by our Cloud Monitoring uptime checks (task 2.7).
	router.GET("/healthz", healthCheckHandler)

	// Start server. The port is exposed in our api.Dockerfile.
	// We'll eventually pull the port from env vars.
	router.Run(":8080")
}

// healthCheckHandler responds with a simple health status.
func healthCheckHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "ok",
	})
}
