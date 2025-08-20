package handlers

import (
	"database/sql"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"

	"finspeed/api/internal/config"
	"finspeed/api/internal/database"
)

type AuthHandler struct {
	db     *database.DB
	logger *zap.Logger
	config *config.Config
}

type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	Token     string `json:"token"`
	ExpiresAt int64  `json:"expires_at"`
	User      User   `json:"user"`
}

type User struct {
	ID    int64  `json:"id"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

type UpdateUserRequest struct {
	Email *string `json:"email,omitempty"`
	Role  *string `json:"role,omitempty"`
}

type UsersResponse struct {
	Users []User `json:"users"`
	Total int    `json:"total"`
	Page  int    `json:"page"`
	Limit int    `json:"limit"`
}

type Claims struct {
	UserID int64  `json:"user_id"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

func NewAuthHandler(db *database.DB, logger *zap.Logger, config *config.Config) *AuthHandler {
	return &AuthHandler{
		db:     db,
		logger: logger,
		config: config,
	}
}

// Register handles user registration
func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.Warn("Invalid registration request", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		h.logger.Error("Failed to hash password", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	// Insert user into database
	var userID int64
	var email, role string
	err = h.db.QueryRow(
		"INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'customer') RETURNING id, email, role",
		req.Email, string(hashedPassword),
	).Scan(&userID, &email, &role)

	if err != nil {
		h.logger.Error("Failed to create user", zap.Error(err))
		if err.Error() == "pq: duplicate key value violates unique constraint \"users_email_key\"" {
			c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// Generate JWT token
	token, expiresAt, err := h.generateToken(userID, email, role)
	if err != nil {
		h.logger.Error("Failed to generate token", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	h.logger.Info("User registered successfully", zap.Int64("user_id", userID), zap.String("email", email))

	c.JSON(http.StatusCreated, AuthResponse{
		Token:     token,
		ExpiresAt: expiresAt,
		User: User{
			ID:    userID,
			Email: email,
			Role:  role,
		},
	})
}

// Login handles user authentication
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.Warn("Invalid login request binding", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	h.logger.Info("Login attempt payload", zap.String("email", req.Email), zap.String("password", req.Password))

	// Get user from database
	var userID int64
	var email, role, passwordHash string
	err := h.db.QueryRow(
		"SELECT id, email, role, password_hash FROM users WHERE email = $1",
		req.Email,
	).Scan(&userID, &email, &role, &passwordHash)

	if err != nil {
		h.logger.Warn("Login attempt with invalid email", zap.String("email", req.Email))
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)); err != nil {
		h.logger.Warn("Login attempt with invalid password", zap.String("email", req.Email))
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Generate JWT token
	token, expiresAt, err := h.generateToken(userID, email, role)
	if err != nil {
		h.logger.Error("Failed to generate token", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	h.logger.Info("User logged in successfully", zap.Int64("user_id", userID), zap.String("email", email))

	c.JSON(http.StatusOK, AuthResponse{
		Token:     token,
		ExpiresAt: expiresAt,
		User: User{
			ID:    userID,
			Email: email,
			Role:  role,
		},
	})
}

// generateToken creates a JWT token for the user
// GetUsers handles fetching all users for admin
// GetUser handles fetching a single user by ID
func (h *AuthHandler) GetUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var user User
	err = h.db.QueryRow("SELECT id, email, role FROM users WHERE id = $1", id).Scan(&user.ID, &user.Email, &user.Role)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		h.logger.Error("Failed to query user", zap.Error(err), zap.Int64("user_id", id))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// UpdateUser handles updating a user's details
func (h *AuthHandler) UpdateUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var req UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	var updates []string
	var params []interface{}

	if req.Email != nil {
		params = append(params, *req.Email)
		updates = append(updates, "email = $"+strconv.Itoa(len(params)))
	}
	if req.Role != nil {
		params = append(params, *req.Role)
		updates = append(updates, "role = $"+strconv.Itoa(len(params)))
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No fields to update"})
		return
	}

	params = append(params, id)
	query := "UPDATE users SET " + strings.Join(updates, ", ") + " WHERE id = $" + strconv.Itoa(len(params))

	_, err = h.db.Exec(query, params...)
	if err != nil {
		h.logger.Error("Failed to update user", zap.Error(err), zap.Int64("user_id", id))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	// Fetch the updated user to return it
	var updatedUser User
	err = h.db.QueryRow("SELECT id, email, role FROM users WHERE id = $1", id).Scan(&updatedUser.ID, &updatedUser.Email, &updatedUser.Role)
	if err != nil {
		h.logger.Error("Failed to fetch updated user", zap.Error(err), zap.Int64("user_id", id))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch updated user details"})
		return
	}

	c.JSON(http.StatusOK, updatedUser)
}

// DeleteUser handles deleting a user
func (h *AuthHandler) DeleteUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	_, err = h.db.Exec("DELETE FROM users WHERE id = $1", id)
	if err != nil {
		h.logger.Error("Failed to delete user", zap.Error(err), zap.Int64("user_id", id))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

func (h *AuthHandler) GetUsers(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	search := c.Query("search")

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	offset := (page - 1) * limit

	baseQuery := "SELECT id, email, role FROM users"
	countQuery := "SELECT COUNT(*) FROM users"
	args := []interface{}{}
	whereClauses := []string{}
	argCount := 1

	if search != "" {
		whereClauses = append(whereClauses, "email ILIKE $" + strconv.Itoa(argCount))
		args = append(args, "%"+search+"%")
		argCount++
	}

	if len(whereClauses) > 0 {
		whereStatement := " WHERE " + strings.Join(whereClauses, " AND ")
		baseQuery += whereStatement
		countQuery += whereStatement
	}

	var total int
	if err := h.db.QueryRow(countQuery, args...).Scan(&total); err != nil {
		h.logger.Error("Failed to get users count", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	baseQuery += " ORDER BY created_at DESC LIMIT $" + strconv.Itoa(argCount) + " OFFSET $" + strconv.Itoa(argCount+1)
	args = append(args, limit, offset)

	rows, err := h.db.Query(baseQuery, args...)
	if err != nil {
		h.logger.Error("Failed to fetch users", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		if err := rows.Scan(&user.ID, &user.Email, &user.Role); err != nil {
			h.logger.Error("Failed to scan user row", zap.Error(err))
			// Don't return on a single row scan error, just log and continue
			continue
		}
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		h.logger.Error("Error iterating user rows", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	c.JSON(http.StatusOK, UsersResponse{
		Users: users,
		Total: total,
		Page:  page,
		Limit: limit,
	})
}

// generateToken creates a JWT token for the user
func (h *AuthHandler) generateToken(userID int64, email, role string) (string, int64, error) {
	expiresAt := time.Now().Add(24 * time.Hour).Unix()

	claims := Claims{
		UserID: userID,
		Email:  email,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Unix(expiresAt, 0)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "finspeed-api",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(h.config.JWTSecret))
	if err != nil {
		return "", 0, err
	}

	return tokenString, expiresAt, nil
}
