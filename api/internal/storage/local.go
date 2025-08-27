package storage

import (
	"context"
	"fmt"
	"io"
	"os"
	"path"
	"path/filepath"
	"strings"
)

type LocalStorage struct {
	root      string // filesystem root, e.g., ./uploads
	apiPrefix string // URL prefix exposed by API, e.g., /api/v1/uploads
}

func NewLocal(root, apiPrefix string) *LocalStorage {
	return &LocalStorage{root: root, apiPrefix: strings.TrimRight(apiPrefix, "/")}
}

func (s *LocalStorage) SaveProductImage(ctx context.Context, productID int64, filename string, contentType string, r io.Reader) (string, error) {
	_ = contentType // not used for local FS, but kept for interface compatibility
	dir := filepath.Join(s.root, "products", fmt.Sprint(productID))
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return "", err
	}
	p := filepath.Join(dir, filename)
	f, err := os.Create(p)
	if err != nil {
		return "", err
	}
	defer f.Close()
	if _, err := io.Copy(f, r); err != nil {
		return "", err
	}
	// Build URL with POSIX-style slashes
	url := path.Join(s.apiPrefix, "products", fmt.Sprint(productID), filename)
	if !strings.HasPrefix(url, "/") {
		url = "/" + url
	}
	return url, nil
}

func (s *LocalStorage) DeleteByURL(ctx context.Context, url string) error {
	prefix := s.apiPrefix
	if !strings.HasPrefix(prefix, "/") {
		prefix = "/" + prefix
	}
	if !strings.HasPrefix(url, prefix) {
		return nil // not a local file we manage
	}
	rel := strings.TrimPrefix(url, prefix)
	rel = strings.TrimPrefix(rel, "/")
	fsPath := filepath.Join(s.root, rel)
	if err := os.Remove(fsPath); err != nil && !os.IsNotExist(err) {
		return err
	}
	return nil
}
