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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{product.id ? 'Edit Product' : 'Add Product'}</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border rounded" />
          <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="Slug" className="w-full p-2 border rounded" />
          <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full p-2 border rounded" />
          <input type="text" name="sku" value={formData.sku || ''} onChange={handleChange} placeholder="SKU" className="w-full p-2 border rounded" />
          <input type="number" name="stock_qty" value={formData.stock_qty} onChange={handleChange} placeholder="Stock Quantity" className="w-full p-2 border rounded" />
          <select name="category_id" value={formData.category_id || ''} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {product.id ? (
            <div className="mt-4 border-t pt-4">
              <h4 className="text-md font-semibold text-gray-900 mb-2">Images</h4>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full"
                />
                <input
                  type="text"
                  placeholder="Alt text (optional)"
                  value={uploadAlt}
                  onChange={(e) => setUploadAlt(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={uploadPrimary}
                    onChange={(e) => setUploadPrimary(e.target.checked)}
                  />
                  <span>Set as primary</span>
                </label>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!uploadFile || uploading}
                  className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>

              {images.length > 0 ? (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {images.map((img) => (
                    <div key={img.id} className="border rounded p-2 flex flex-col items-center">
                      <img src={resolveImageUrl(img.url)} alt={img.alt || ''} className="w-24 h-24 object-cover rounded" />
                      {img.is_primary ? (
                        <span className="mt-2 text-xs text-green-700 font-medium">Primary</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(img.id)}
                          className="mt-2 text-xs text-indigo-600 hover:underline"
                        >
                          Set primary
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                        className="mt-1 text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-500">No images yet.</p>
              )}
            </div>
          ) : null}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
