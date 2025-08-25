package storage

import (
	"context"
	"io"
)

type Storage interface {
	// SaveProductImage saves the product image and returns a public URL
	SaveProductImage(ctx context.Context, productID int64, filename string, contentType string, r io.Reader) (string, error)
	// DeleteByURL deletes the underlying object given its public URL. It should be idempotent.
	DeleteByURL(ctx context.Context, url string) error
}
