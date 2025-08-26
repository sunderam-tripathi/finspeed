'use client';

import React, { useEffect, useState, useCallback } from 'react';
import ProductModal from '@/components/admin/ProductModal';
import { apiClient } from '@/lib/api';

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
    try {
      const data = await apiClient.getProducts({ page, limit, search: search || undefined });
      setProducts((data.products || []).map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        price: p.price,
        stock_qty: p.stock_qty,
        category_id: p.category_id ?? null,
        sku: p.sku ?? null,
      })));
      setTotalProducts(data.total || 0);
      setCurrentPage(data.page ?? page);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
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

    try {
      await apiClient.deleteProduct(productId);
      await fetchProducts(currentPage, searchTerm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const handleSaveProduct = async (productToSave: Omit<Product, 'id'> & { id?: number }) => {
    try {
      const base = {
        title: productToSave.title,
        slug: productToSave.slug,
        price: Number(productToSave.price),
        stock_qty: Number(productToSave.stock_qty),
        sku: productToSave.sku && productToSave.sku.trim() !== '' ? productToSave.sku : undefined,
        category_id: productToSave.category_id ?? undefined,
      };

      if (productToSave.id) {
        await apiClient.updateProduct(productToSave.id, base);
      } else {
        await apiClient.createProduct({ ...base, currency: 'INR' });
      }
      handleCloseModal();
      await fetchProducts(currentPage, searchTerm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[color:var(--md-sys-color-on-surface)]">Products</h1>
          <p className="mt-2 text-[color:var(--md-sys-color-on-surface-variant)]">Manage your product catalog</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="bg-[color:var(--md-sys-color-primary)] text-[color:var(--md-sys-color-on-primary)] px-6 py-3 rounded-lg hover:opacity-90 font-medium shadow-sm"
        >
          Add Product
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products by name, SKU, or slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-[color:var(--md-sys-color-outline)] rounded-lg bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[color:var(--md-sys-color-primary)] placeholder-[color:var(--md-sys-color-on-surface-variant)]"
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--md-sys-color-primary)]"></div>
          <span className="ml-3 text-[color:var(--md-sys-color-on-surface-variant)]">Loading products...</span>
        </div>
      )}
      {error && (
        <div className="bg-[color:var(--md-sys-color-error-container)] border border-[color:var(--md-sys-color-error)] rounded-lg p-4 mb-6">
          <p className="text-[color:var(--md-sys-color-on-error-container)]">Error: {error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="bg-[color:var(--md-sys-color-surface-container-highest)] shadow-sm rounded-xl overflow-hidden border border-[color:var(--md-sys-color-outline-variant)]">
          <table className="min-w-full divide-y divide-[color:var(--md-sys-color-outline-variant)]">
            <thead className="bg-[color:var(--md-sys-color-surface-container)]">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-[color:var(--md-sys-color-on-surface)] uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-[color:var(--md-sys-color-on-surface)] uppercase tracking-wider">SKU</th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-[color:var(--md-sys-color-on-surface)] uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-[color:var(--md-sys-color-on-surface)] uppercase tracking-wider">Stock</th>
                <th scope="col" className="relative px-6 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-[color:var(--md-sys-color-surface-container-highest)] divide-y divide-[color:var(--md-sys-color-outline-variant)]">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-[color:var(--md-sys-color-surface-container)] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[color:var(--md-sys-color-on-surface)]">{product.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--md-sys-color-on-surface-variant)]">{product.sku || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--md-sys-color-on-surface-variant)]">₹{product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--md-sys-color-on-surface-variant)]">{product.stock_qty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button onClick={() => handleEditProduct(product)} className="text-[color:var(--md-sys-color-primary)] hover:underline font-medium">Edit</button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="text-[color:var(--md-sys-color-error)] hover:underline font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && !error && totalProducts > limit && (
        <div className="mt-8 flex justify-center items-center">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-[color:var(--md-sys-color-on-surface)] bg-[color:var(--md-sys-color-surface-container)] rounded-lg border border-[color:var(--md-sys-color-outline)] hover:bg-[color:var(--md-sys-color-surface-container-high)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="mx-6 text-sm text-[color:var(--md-sys-color-on-surface-variant)] font-medium">
            Page {currentPage} of {Math.ceil(totalProducts / limit)}
          </span>
          <button
            onClick={() => setCurrentPage(p => (p * limit < totalProducts ? p + 1 : p))}
            disabled={currentPage * limit >= totalProducts}
            className="px-4 py-2 text-sm font-medium text-[color:var(--md-sys-color-on-surface)] bg-[color:var(--md-sys-color-surface-container)] rounded-lg border border-[color:var(--md-sys-color-outline)] hover:bg-[color:var(--md-sys-color-surface-container-high)] disabled:opacity-50 disabled:cursor-not-allowed"
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
