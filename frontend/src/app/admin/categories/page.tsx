'use client';

import React, { useEffect, useState, useCallback } from 'react';
import CategoryModal from '@/components/admin/CategoryModal';

// Define the Category type based on your API response
interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [totalCategories, setTotalCategories] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10); // Categories per page
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCategories = useCallback(async (page: number, search: string) => {
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/categories?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      const data = await response.json();
      setCategories(data.categories || []);
      setTotalCategories(data.total || 0);
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
      fetchCategories(currentPage, searchTerm);
    }, 500); // Debounce search input

    return () => clearTimeout(timer);
  }, [fetchCategories, currentPage, searchTerm]);

  const handleAddCategory = () => {
    setSelectedCategory({ id: 0, name: '', slug: '', description: '' });
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }

      await fetchCategories(currentPage, searchTerm);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSaveCategory = async (categoryToSave: Omit<Category, 'id'> & { id?: number }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found.');
      return;
    }

    const method = categoryToSave.id ? 'PUT' : 'POST';
    const url = categoryToSave.id
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/categories/${categoryToSave.id}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/categories`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(categoryToSave.id ? categoryToSave : { name: categoryToSave.name, slug: categoryToSave.slug, description: categoryToSave.description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save category');
      }

      handleCloseModal();
      await fetchCategories(currentPage, searchTerm);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <button onClick={handleAddCategory} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Add Category
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search categories by name or slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading && <p>Loading categories...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!isLoading && !error && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEditCategory(category)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button onClick={() => handleDeleteCategory(category.id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && !error && totalCategories > limit && (
        <div className="mt-6 flex justify-center items-center">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="mx-4 text-sm text-gray-600">
            Page {currentPage} of {Math.ceil(totalCategories / limit)}
          </span>
          <button
            onClick={() => setCurrentPage(p => (p * limit < totalCategories ? p + 1 : p))}
            disabled={currentPage * limit >= totalCategories}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {isModalOpen && selectedCategory && (
        <CategoryModal
          category={selectedCategory}
          onClose={handleCloseModal}
          onSave={handleSaveCategory}
        />
      )}
    </div>
  );
}
