'use client';

import React, { useEffect, useState, useCallback } from 'react';
import ProductModal from '@/components/admin/ProductModal';

// Define the Product type based on your API response
interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  stock_qty: number;
  category_id: number | null;
  sku: string | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10); // Products per page
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = useCallback(async (page: number, search: string) => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found.');
      setIsLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();
      setProducts(data.products || []);
      setTotalProducts(data.total || 0);
      setCurrentPage(data.page || 1);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(currentPage, searchTerm);
    }, 500); // Debounce search input

    return () => clearTimeout(timer);
  }, [fetchProducts, currentPage, searchTerm]);

  const handleAddProduct = () => {
    setSelectedProduct({ id: 0, title: '', slug: '', price: 0, stock_qty: 0, category_id: null, sku: '' });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete product');
      }

      await fetchProducts(currentPage, searchTerm);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSaveProduct = async (productToSave: Omit<Product, 'id'> & { id?: number }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found.');
      return;
    }

    const method = productToSave.id ? 'PUT' : 'POST';
    const url = productToSave.id
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/products/${productToSave.id}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/products`;

    const body = {
      ...productToSave,
      price: Number(productToSave.price),
      stock_qty: Number(productToSave.stock_qty),
      category_id: productToSave.category_id ? Number(productToSave.category_id) : null,
    };
    if (!body.id) {
      delete body.id;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save product');
      }

      handleCloseModal();
      await fetchProducts(currentPage, searchTerm);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <button
          onClick={handleAddProduct}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products by name, SKU, or slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading && <p>Loading products...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!isLoading && !error && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock_qty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEditProduct(product)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && !error && totalProducts > limit && (
        <div className="mt-6 flex justify-center items-center">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="mx-4 text-sm text-gray-600">
            Page {currentPage} of {Math.ceil(totalProducts / limit)}
          </span>
          <button
            onClick={() => setCurrentPage(p => (p * limit < totalProducts ? p + 1 : p))}
            disabled={currentPage * limit >= totalProducts}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {isModalOpen && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}
