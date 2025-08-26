'use client';

import React, { useEffect, useState, useCallback } from 'react';
import CategoryModal from '@/components/admin/CategoryModal';
import { apiClient } from '@/lib/api';
import type { Category } from '@/lib/api';

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
    try {
      const data = await apiClient.getCategories({ page, limit, search: search || undefined });
      setCategories(data.categories || []);
      setTotalCategories(data.total || 0);
      setCurrentPage(data.page ?? page);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
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

    try {
      await apiClient.deleteCategory(categoryId);
      await fetchCategories(currentPage, searchTerm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  const handleSaveCategory = async (categoryToSave: Omit<Category, 'id'> & { id?: number }) => {
    try {
      const payload = { name: categoryToSave.name, slug: categoryToSave.slug, description: categoryToSave.description ?? null };
      if (categoryToSave.id) {
        await apiClient.updateCategory(categoryToSave.id, payload);
      } else {
        await apiClient.createCategory(payload);
      }
      handleCloseModal();
      await fetchCategories(currentPage, searchTerm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[color:var(--md-sys-color-on-surface)]">Categories</h1>
          <p className="mt-2 text-[color:var(--md-sys-color-on-surface-variant)]">Organize your products with categories</p>
        </div>
        <button onClick={handleAddCategory} className="bg-[color:var(--md-sys-color-primary)] text-[color:var(--md-sys-color-on-primary)] px-6 py-3 rounded-lg hover:opacity-90 font-medium shadow-sm">
          Add Category
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search categories by name or slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-[color:var(--md-sys-color-outline)] rounded-lg bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[color:var(--md-sys-color-primary)] placeholder-[color:var(--md-sys-color-on-surface-variant)]"
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--md-sys-color-primary)]"></div>
          <span className="ml-3 text-[color:var(--md-sys-color-on-surface-variant)]">Loading categories...</span>
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
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-[color:var(--md-sys-color-on-surface)] uppercase tracking-wider">Slug</th>
                <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-[color:var(--md-sys-color-surface-container-highest)] divide-y divide-[color:var(--md-sys-color-outline-variant)]">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-[color:var(--md-sys-color-surface-container)] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[color:var(--md-sys-color-on-surface)]">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--md-sys-color-on-surface-variant)]">{category.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button onClick={() => handleEditCategory(category)} className="text-[color:var(--md-sys-color-primary)] hover:underline font-medium">Edit</button>
                    <button onClick={() => handleDeleteCategory(category.id)} className="text-[color:var(--md-sys-color-error)] hover:underline font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && !error && totalCategories > limit && (
        <div className="mt-8 flex justify-center items-center">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-[color:var(--md-sys-color-on-surface)] bg-[color:var(--md-sys-color-surface-container)] rounded-lg border border-[color:var(--md-sys-color-outline)] hover:bg-[color:var(--md-sys-color-surface-container-high)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="mx-6 text-sm text-[color:var(--md-sys-color-on-surface-variant)] font-medium">
            Page {currentPage} of {Math.ceil(totalCategories / limit)}
          </span>
          <button
            onClick={() => setCurrentPage(p => (p * limit < totalCategories ? p + 1 : p))}
            disabled={currentPage * limit >= totalCategories}
            className="px-4 py-2 text-sm font-medium text-[color:var(--md-sys-color-on-surface)] bg-[color:var(--md-sys-color-surface-container)] rounded-lg border border-[color:var(--md-sys-color-outline)] hover:bg-[color:var(--md-sys-color-surface-container-high)] disabled:opacity-50 disabled:cursor-not-allowed"
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
