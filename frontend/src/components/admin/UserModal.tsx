'use client';

import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  role: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  user: User | null;
}

export default function UserModal({ isOpen, onClose, onSave, user }: UserModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('customer');

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setRole(user.role);
    } else {
      setEmail('');
      setRole('customer');
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!user) return;
    onSave({ ...user, email, role });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{user ? 'Edit User' : 'Add User'}</h3>
          <div className="mt-2 px-7 py-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-3 px-3 py-2 text-gray-700 bg-gray-100 rounded-md w-full"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mb-3 px-3 py-2 text-gray-700 bg-gray-100 rounded-md w-full"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="mt-3 px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
