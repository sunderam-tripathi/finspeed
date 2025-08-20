'use client';

import React, { useState, useEffect } from 'react';

interface Category {
  id: number;
  name: string;
}

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
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Fetch categories for the dropdown
    const fetchCategories = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/categories`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setCategories(data.categories);
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
