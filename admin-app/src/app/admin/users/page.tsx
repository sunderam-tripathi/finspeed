'use client';

import React, { useEffect, useState, useCallback } from 'react';
import UserModal from '@/components/admin/UserModal';
import { apiClient } from '@/lib/api';

// Define the User type based on your API response
interface User {
  id: number;
  email: string;
  role: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10); // Users per page
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = useCallback(async (page: number, search: string) => {
    setIsLoading(true);
    try {
      const data = await apiClient.getUsers({ page, limit, search: search || undefined });
      setUsers(data.users || []);
      setTotalUsers(data.total || 0);
      setCurrentPage(data.page || page);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(currentPage, searchTerm);
    }, 500); // Debounce search input

    return () => clearTimeout(timer);
  }, [fetchUsers, currentPage, searchTerm]);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleSaveUser = async (updatedUser: User) => {
    try {
      await apiClient.updateUser(updatedUser.id, { email: updatedUser.email, role: updatedUser.role });
      await fetchUsers(currentPage, searchTerm); // Refresh the list
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    try {
      await apiClient.deleteUser(userId);
      await fetchUsers(currentPage, searchTerm); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[color:var(--md-sys-color-on-surface)]">Users</h1>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-[color:var(--md-sys-color-outline)] rounded-lg bg-[color:var(--md-sys-color-surface)] text-[color:var(--md-sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[color:var(--md-sys-color-primary)] placeholder-[color:var(--md-sys-color-on-surface-variant)]"
        />
      </div>

      {isLoading && <p className="text-[color:var(--md-sys-color-on-surface-variant)]">Loading users...</p>}
      {error && (
        <div className="mb-4 p-4 bg-[color:var(--md-sys-color-error-container)] border border-[color:var(--md-sys-color-error)] rounded-lg">
          <p className="text-[color:var(--md-sys-color-on-error-container)] font-medium">Error: {error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="bg-[color:var(--md-sys-color-surface-container)] shadow-md rounded-xl overflow-hidden border border-[color:var(--md-sys-color-outline-variant)]">
          <table className="min-w-full divide-y divide-[color:var(--md-sys-color-outline-variant)]">
            <thead className="bg-[color:var(--md-sys-color-surface-container-highest)]">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-[color:var(--md-sys-color-on-surface)] uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-[color:var(--md-sys-color-on-surface)] uppercase tracking-wider">Role</th>
                <th scope="col" className="relative px-6 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-[color:var(--md-sys-color-surface-container)] divide-y divide-[color:var(--md-sys-color-outline-variant)]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[color:var(--md-sys-color-surface-container-highest)] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[color:var(--md-sys-color-on-surface)]">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button 
                      onClick={() => handleEditClick(user)} 
                      className="px-3 py-1.5 text-sm font-medium text-[color:var(--md-sys-color-primary)] hover:bg-[color:var(--md-sys-color-primary-container)] hover:text-[color:var(--md-sys-color-on-primary-container)] rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)} 
                      className="px-3 py-1.5 text-sm font-medium text-[color:var(--md-sys-color-error)] hover:bg-[color:var(--md-sys-color-error-container)] hover:text-[color:var(--md-sys-color-on-error-container)] rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && !error && totalUsers > limit && (
        <div className="mt-6 flex justify-center items-center">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="mx-4 text-sm text-gray-600">
            Page {currentPage} of {Math.ceil(totalUsers / limit)}
          </span>
          <button
            onClick={() => setCurrentPage(p => (p * limit < totalUsers ? p + 1 : p))}
            disabled={currentPage * limit >= totalUsers}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <UserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        user={selectedUser}
      />
    </div>
  );
}
