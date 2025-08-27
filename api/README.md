# Finspeed API

Go-based REST API for the Finspeed e-commerce platform.

## Features

- User authentication and authorization
- Product management with image uploads
- Category management
- Order processing
- Image upload and management
- Admin functionality with Material You styling support

## Development

```bash
# Install dependencies
go mod download

# Run the server
go run cmd/server/main.go
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 8080)
- `ENVIRONMENT`: Environment (development, staging, production)

## API Documentation

The API follows RESTful conventions with the following main endpoints:

- `/api/v1/auth/*` - Authentication endpoints
- `/api/v1/products/*` - Product management
- `/api/v1/categories/*` - Category management
- `/api/v1/admin/*` - Admin functionality
- `/api/v1/orders/*` - Order processing

## Database Migrations

Migrations are handled automatically on startup in production environments.

## Recent Updates

- Fixed admin API client method signatures
- Enhanced product image upload functionality
- Improved cross-domain authentication support
