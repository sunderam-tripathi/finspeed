'use client';

import React, { useState } from 'react';
import type { Category } from '@/lib/api';

interface CategoryModalProps {
  category: Category | null;
  onClose: () => void;
  onSave: (category: Omit<Category, 'id'> & { id?: number }) => void;
}

export default function CategoryModal({ category, onClose, onSave }: CategoryModalProps) {
  const [formData, setFormData] = useState<Omit<Category, 'id'> & { id?: number }>(
    category || { name: '', slug: '', description: '' }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!category) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-lg shadow-lg rounded-lg bg-[color:var(--md-sys-color-surface)] border-[color:var(--md-sys-color-outline-variant)]">
        <h3 className="text-xl font-semibold text-[color:var(--md-sys-color-on-surface)] mb-6">{category.id ? 'Edit Category' : 'Add Category'}</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[color:var(--md-sys-color-on-surface)] mb-2">Category Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter category name" className="w-full p-3 border border-[color:var(--md-sys-color-outline)] rounded-lg bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[color:var(--md-sys-color-primary)]" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-[color:var(--md-sys-color-on-surface)] mb-2">URL Slug</label>
            <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="category-url-slug" className="w-full p-3 border border-[color:var(--md-sys-color-outline)] rounded-lg bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[color:var(--md-sys-color-primary)]" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-[color:var(--md-sys-color-on-surface)] mb-2">Description (Optional)</label>
            <textarea name="description" value={formData.description ?? ''} onChange={handleChange} placeholder="Describe this category" rows={3} className="w-full p-3 border border-[color:var(--md-sys-color-outline)] rounded-lg bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[color:var(--md-sys-color-primary)] resize-none" />
          </div>
          <div className="flex justify-end space-x-3 pt-6 border-t border-[color:var(--md-sys-color-outline-variant)]">
            <button type="button" onClick={onClose} className="px-6 py-3 bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface)] rounded-lg hover:bg-[color:var(--md-sys-color-surface-container-high)] border border-[color:var(--md-sys-color-outline)]">Cancel</button>
            <button type="submit" className="px-6 py-3 bg-[color:var(--md-sys-color-primary)] text-[color:var(--md-sys-color-on-primary)] rounded-lg hover:opacity-90 font-medium">Save Category</button>
          </div>
        </form>
      </div>
    </div>
  );
}
