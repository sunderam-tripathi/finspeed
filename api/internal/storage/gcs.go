package storage

import (
	"context"
	"fmt"
	"io"
	"net/url"
	"path"
	"strings"
	"time"

	cloudstorage "cloud.google.com/go/storage"
	"go.uber.org/zap"
)

type GCSStorage struct {
	client   *cloudstorage.Client
	bucket   string
	baseURL  string // optional CDN/custom domain; if empty, use https://storage.googleapis.com/<bucket>
	logger   *zap.Logger
}

func NewGCS(ctx context.Context, bucketName string, baseURL string, logger *zap.Logger) (*GCSStorage, error) {
	client, err := cloudstorage.NewClient(ctx)
	if err != nil {
		return nil, err
	}
	return &GCSStorage{
		client:  client,
		bucket:  bucketName,
		baseURL: strings.TrimRight(baseURL, "/"),
		logger:  logger,
	}, nil
}

func (s *GCSStorage) publicURL(object string) string {
	if s.baseURL != "" {
		return s.baseURL + "/" + path.Clean(object)
	}
	return fmt.Sprintf("https://storage.googleapis.com/%s/%s", s.bucket, path.Clean(object))
}

func (s *GCSStorage) SaveProductImage(ctx context.Context, productID int64, filename string, contentType string, r io.Reader) (string, error) {
	object := path.Join("products", fmt.Sprint(productID), filename)
	w := s.client.Bucket(s.bucket).Object(object).NewWriter(ctx)
	w.ContentType = contentType
	w.CacheControl = "public, max-age=31536000, immutable"
	if _, err := io.Copy(w, r); err != nil {
		_ = w.Close()
		return "", err
	}
	if err := w.Close(); err != nil {
		return "", err
	}
	return s.publicURL(object), nil
}

func (s *GCSStorage) DeleteByURL(ctx context.Context, u string) error {
	// Accept URLs like:
	//  - https://storage.googleapis.com/<bucket>/<object>
	//  - <baseURL>/<object>
	parsed, err := url.Parse(u)
	if err != nil || parsed.Scheme == "" {
		// Not a URL we can parse; ignore
		return nil
	}
	var object string
	if s.baseURL != "" {
		base, err := url.Parse(s.baseURL)
		if err == nil && base.Host == parsed.Host {
			object = strings.TrimPrefix(parsed.Path, "/")
		}
	}
	if object == "" {
		// try storage.googleapis.com
		if parsed.Host == "storage.googleapis.com" {
			parts := strings.SplitN(strings.TrimPrefix(parsed.Path, "/"), "/", 2)
			if len(parts) == 2 && parts[0] == s.bucket {
				object = parts[1]
			}
		}
	}
	if object == "" {
		return nil
	}
	ctx, cancel := context.WithTimeout(ctx, 20*time.Second)
	defer cancel()
	return s.client.Bucket(s.bucket).Object(object).Delete(ctx)
}
