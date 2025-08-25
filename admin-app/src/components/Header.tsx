'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import ThemeControls from '@/components/ThemeControls';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAuthenticated = true; // Assume admin is always authenticated

  // Check if current route is active
  const isActive = (path: string) => {
    return pathname?.startsWith(path);
  };

  return (
    <header className="top-app-bar md-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center">
              <span className="text-2xl font-bold">Finspeed</span>
              <span className="ml-2 text-sm text-[color:var(--md-sys-color-outline)] hidden sm:block">Admin</span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-[color:var(--md-sys-color-outline)]" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 md-textfield leading-5 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              href="/admin/dashboard" 
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                isActive('/admin/dashboard') 
                  ? 'bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]' 
                  : 'text-[color:var(--md-sys-color-on-surface-variant)] hover:bg-[color:var(--md-sys-color-surface-container-highest)]'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/admin/products" 
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                isActive('/admin/products')
                  ? 'bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]' 
                  : 'text-[color:var(--md-sys-color-on-surface-variant)] hover:bg-[color:var(--md-sys-color-surface-container-highest)]'
              }`}
            >
              Products
            </Link>
            <Link 
              href="/admin/orders" 
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                isActive('/admin/orders')
                  ? 'bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]' 
                  : 'text-[color:var(--md-sys-color-on-surface-variant)] hover:bg-[color:var(--md-sys-color-surface-container-highest)]'
              }`}
            >
              Orders
            </Link>
            <Link 
              href="/admin/users" 
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                isActive('/admin/users')
                  ? 'bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]' 
                  : 'text-[color:var(--md-sys-color-on-surface-variant)] hover:bg-[color:var(--md-sys-color-surface-container-highest)]'
              }`}
            >
              Users
            </Link>

            {/* User Menu */}
            <div className="flex items-center space-x-2 ml-4">
              <ThemeControls />
              <div className="relative">
                <button 
                  className="p-2 rounded-full hover:bg-[color:var(--md-sys-color-surface-container-highest)]"
                  aria-label="User menu"
                >
                  <UserIcon className="h-6 w-6 text-[color:var(--md-sys-color-on-surface)]" />
                </button>
              </div>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-[color:var(--md-sys-color-outline)]" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-2 md-textfield leading-5 placeholder-gray-500"
            />
          </div>
          {(process.env.NEXT_PUBLIC_ENABLE_M3 === '1' || process.env.NEXT_PUBLIC_ENABLE_M3 === 'true') && (
            <div className="mt-3 flex justify-end">
              <ThemeControls />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 md-surface border-t border-[color:var(--md-sys-color-outline-variant)]">
            <Link
              href="/admin/dashboard"
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                isActive('/admin/dashboard')
                  ? 'bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]' 
                  : 'text-[color:var(--md-sys-color-on-surface)] hover:bg-[color:var(--md-sys-color-surface-container-highest)]'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                isActive('/admin/products')
                  ? 'bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]' 
                  : 'text-[color:var(--md-sys-color-on-surface)] hover:bg-[color:var(--md-sys-color-surface-container-highest)]'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/admin/orders"
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                isActive('/admin/orders')
                  ? 'bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]' 
                  : 'text-[color:var(--md-sys-color-on-surface)] hover:bg-[color:var(--md-sys-color-surface-container-highest)]'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Orders
            </Link>
            <Link
              href="/admin/users"
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                isActive('/admin/users')
                  ? 'bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]' 
                  : 'text-[color:var(--md-sys-color-on-surface)] hover:bg-[color:var(--md-sys-color-surface-container-highest)]'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Users
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
