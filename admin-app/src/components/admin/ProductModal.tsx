'use client';

import React, { useState, useEffect } from 'react';
import { apiClient, Category as ApiCategory, ProductImage as ApiProductImage } from '@/lib/api';

// Using Category type from api client (ApiCategory)

interface Product {
  id?: number;
  title: string;
  slug: string;
  price: number;
  stock_qty: number;
  category_id: number | null;
  sku: string | null;
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export default function ProductModal({ product, onClose, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState<Product>(product || { title: '', slug: '', price: 0, stock_qty: 0, category_id: null, sku: null });
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [images, setImages] = useState<ApiProductImage[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState('');
  const [uploadPrimary, setUploadPrimary] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Derive API origin for static assets served from API (e.g., /api/v1/uploads/...)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
  const apiOrigin = React.useMemo(() => {
    try {
      const u = new URL(API_URL);
      return `${u.protocol}//${u.host}`;
    } catch {
      return 'http://localhost:8080';
    }
  }, [API_URL]);
  const resolveImageUrl = (url: string) => (url.startsWith('/api/') ? `${apiOrigin}${url}` : url);

  useEffect(() => {
    // Fetch categories for the dropdown via centralized apiClient
    const fetchCategories = async () => {
      try {
        const data = await apiClient.getCategories();
        setCategories(data.categories);
      } catch {
        // Silently ignore here; parent page handles errors
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Load images for existing products
  useEffect(() => {
    const refreshImages = async () => {
      if (!product?.slug) return;
      try {
        const p = await apiClient.getProduct(product.slug);
        setImages(p.images || []);
      } catch {
        setImages([]);
      }
    };
    if (product?.id) {
      refreshImages();
    }
  }, [product?.id, product?.slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      switch (name) {
        case 'price':
          return { ...prev, price: Number(value) };
        case 'stock_qty':
          return { ...prev, stock_qty: Number(value) };
        case 'category_id':
          return { ...prev, category_id: value === '' ? null : Number(value) };
        case 'sku':
          return { ...prev, sku: value.trim() === '' ? null : value };
        case 'title':
          return { ...prev, title: value };
        case 'slug':
          return { ...prev, slug: value };
        default:
          return prev;
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleUpload = async () => {
    if (!product?.id || !uploadFile) return;
    setUploading(true);
    try {
      await apiClient.uploadProductImage(product.id, uploadFile, {
        alt: uploadAlt || undefined,
        is_primary: uploadPrimary,
      });
      // reset inputs and refresh images
      setUploadFile(null);
      setUploadAlt('');
      setUploadPrimary(false);
      const p = await apiClient.getProduct(product.slug);
      setImages(p.images || []);
    } catch (e) {
      // optional: surface a toast
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!product?.id) return;
    try {
      await apiClient.deleteProductImage(product.id, imageId);
      const p = await apiClient.getProduct(product.slug);
      setImages(p.images || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSetPrimary = async (imageId: number) => {
    if (!product?.id) return;
    try {
      await apiClient.setPrimaryProductImage(product.id, imageId);
      const p = await apiClient.getProduct(product.slug);
      setImages(p.images || []);
    } catch (e) {
      console.error(e);
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto p-6 border border-[color:var(--md-sys-color-outline)] w-full max-w-2xl shadow-xl rounded-xl bg-[color:var(--md-sys-color-surface-container-highest)] max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold leading-6 text-[color:var(--md-sys-color-on-surface)] mb-6">{product.id ? 'Edit Product' : 'Add Product'}</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[color:var(--md-sys-color-on-surface)] mb-2">Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Product title" className="w-full px-4 py-3 border border-[color:var(--md-sys-color-outline)] rounded-lg bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[color:var(--md-sys-color-primary)] placeholder-[color:var(--md-sys-color-on-surface-variant)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[color:var(--md-sys-color-on-surface)] mb-2">Slug</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="product-slug" className="w-full px-4 py-3 border border-[color:var(--md-sys-color-outline)] rounded-lg bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[color:var(--md-sys-color-primary)] placeholder-[color:var(--md-sys-color-on-surface-variant)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[color:var(--md-sys-color-on-surface)] mb-2">Price (₹)</label>
              <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" className="w-full px-4 py-3 border border-[color:var(--md-sys-color-outline)] rounded-lg bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[color:var(--md-sys-color-primary)] placeholder-[color:var(--md-sys-color-on-surface-variant)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[color:var(--md-sys-color-on-surface)] mb-2">SKU</label>
              <input type="text" name="sku" value={formData.sku || ''} onChange={handleChange} placeholder="Product SKU" className="w-full px-4 py-3 border border-[color:var(--md-sys-color-outline)] rounded-lg bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[color:var(--md-sys-color-primary)] placeholder-[color:var(--md-sys-color-on-surface-variant)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[color:var(--md-sys-color-on-surface)] mb-2">Stock Quantity</label>
              <input type="number" name="stock_qty" value={formData.stock_qty} onChange={handleChange} placeholder="0" className="w-full px-4 py-3 border border-[color:var(--md-sys-color-outline)] rounded-lg bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[color:var(--md-sys-color-primary)] placeholder-[color:var(--md-sys-color-on-surface-variant)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[color:var(--md-sys-color-on-surface)] mb-2">Category</label>
              <select name="category_id" value={formData.category_id || ''} onChange={handleChange} className="w-full px-4 py-3 border border-[color:var(--md-sys-color-outline)] rounded-lg bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[color:var(--md-sys-color-primary)]">
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          {product.id ? (
            <div className="border-t border-[color:var(--md-sys-color-outline-variant)] pt-6">
              <h4 className="text-lg font-semibold text-[color:var(--md-sys-color-on-surface)] mb-4">Product Images</h4>
              <div className="bg-[color:var(--md-sys-color-surface-container)] rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[color:var(--md-sys-color-on-surface)] mb-2">Choose Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-[color:var(--md-sys-color-outline)] rounded-lg bg-[color:var(--md-sys-color-surface)] text-[color:var(--md-sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[color:var(--md-sys-color-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[color:var(--md-sys-color-on-surface)] mb-2">Alt Text</label>
                    <input
                      type="text"
                      placeholder="Describe the image"
                      value={uploadAlt}
                      onChange={(e) => setUploadAlt(e.target.value)}
                      className="w-full px-4 py-3 border border-[color:var(--md-sys-color-outline)] rounded-lg bg-[color:var(--md-sys-color-surface)] text-[color:var(--md-sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[color:var(--md-sys-color-primary)] placeholder-[color:var(--md-sys-color-on-surface-variant)]"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={uploadPrimary}
                      onChange={(e) => setUploadPrimary(e.target.checked)}
                      className="w-4 h-4 text-[color:var(--md-sys-color-primary)] border-[color:var(--md-sys-color-outline)] rounded focus:ring-[color:var(--md-sys-color-primary)]"
                    />
                    <span className="text-sm text-[color:var(--md-sys-color-on-surface)]">Set as primary image</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={!uploadFile || uploading}
                    className="px-4 py-2 bg-[color:var(--md-sys-color-primary)] text-[color:var(--md-sys-color-on-primary)] rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </button>
                </div>
              </div>

              {images.length > 0 ? (
                <div className="mt-6">
                  <h5 className="text-sm font-medium text-[color:var(--md-sys-color-on-surface)] mb-3">Current Images</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img) => (
                      <div key={img.id} className="relative group border border-[color:var(--md-sys-color-outline-variant)] rounded-lg p-3 bg-[color:var(--md-sys-color-surface-container)] hover:shadow-md transition-shadow">
                        <img src={resolveImageUrl(img.url)} alt={img.alt || ''} className="w-full h-24 object-cover rounded-md" />
                        {img.is_primary && (
                          <div className="absolute top-1 right-1 bg-[color:var(--md-sys-color-primary)] text-[color:var(--md-sys-color-on-primary)] text-xs px-2 py-1 rounded-full font-medium">
                            Primary
                          </div>
                        )}
                        <div className="mt-2 flex justify-between items-center">
                          {!img.is_primary ? (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(img.id)}
                              className="text-xs text-[color:var(--md-sys-color-primary)] hover:underline font-medium"
                            >
                              Set Primary
                            </button>
                          ) : (
                            <span className="text-xs text-[color:var(--md-sys-color-on-surface-variant)]">Primary</span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(img.id)}
                            className="text-xs text-[color:var(--md-sys-color-error)] hover:underline font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-6 text-center py-8 border-2 border-dashed border-[color:var(--md-sys-color-outline-variant)] rounded-lg">
                  <p className="text-sm text-[color:var(--md-sys-color-on-surface-variant)]">No images uploaded yet. Add your first product image above.</p>
                </div>
              )}
            </div>
          ) : null}
          <div className="flex justify-end space-x-3 pt-6 border-t border-[color:var(--md-sys-color-outline-variant)]">
            <button type="button" onClick={onClose} className="px-6 py-3 bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface)] rounded-lg hover:bg-[color:var(--md-sys-color-surface-container-high)] font-medium border border-[color:var(--md-sys-color-outline)]">Cancel</button>
            <button type="submit" className="px-6 py-3 bg-[color:var(--md-sys-color-primary)] text-[color:var(--md-sys-color-on-primary)] rounded-lg hover:opacity-90 font-medium shadow-sm">Save Product</button>
          </div>
        </form>
      </div>
    </div>
  );
}
