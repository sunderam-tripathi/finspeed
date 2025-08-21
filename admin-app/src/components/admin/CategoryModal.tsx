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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{category.id ? 'Edit Category' : 'Add Category'}</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" required />
          <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="Slug" className="w-full p-2 border rounded" required />
          <textarea name="description" value={formData.description ?? ''} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
