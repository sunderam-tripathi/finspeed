'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { apiClient, Product, Category } from '@/lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 12;

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, currentPage]);

  const loadCategories = async () => {
    try {
      const response = await apiClient.getCategories();
      setCategories(response.categories);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getProducts({
        page: currentPage,
        limit,
        category_id: selectedCategory || undefined,
      });
      
      setProducts(response.products);
      setTotalPages(Math.ceil(response.total / limit));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-gray-600">Discover our premium collection of bicycles and accessories</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === null
                      ? 'bg-primary-100 text-primary-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Products
                </button>
                {categories?.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary-100 text-primary-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <div className="text-red-800">
                    <strong>Error:</strong> {error}
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !products || products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM10 12a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">
                  {selectedCategory 
                    ? 'No products available in this category.' 
                    : 'No products available at the moment.'}
                </p>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  )) || []}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-md ${
                          page === currentPage
                            ? 'bg-primary-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
