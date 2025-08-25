'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { apiClient } from '@/lib/api';
import ThemeControls from '@/components/ThemeControls';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check authentication status only
        setIsAuthenticated(apiClient.isAuthenticated());
      } catch (error) {
        console.error('Failed to check authentication status:', error);
      }
    };

    // Initial load
    checkAuth();

    // Listen for storage changes (login/logout events)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === null) {
        const newAuthState = apiClient.isAuthenticated();
        setIsAuthenticated(newAuthState);
      }
    };

    // Listen for focus events (when user returns to tab)
    const handleFocus = () => {
      checkAuth();
    };

    // Listen for visibility change (when tab becomes visible)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Cart functionality removed from storefront

  return (
    <header className="top-app-bar md-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/brand/logo.svg"
                alt="Finspeed Logo"
                width={28}
                height={28}
                priority
              />
              <Image
                src="/images/brand/finspeed-text.PNG"
                alt="Finspeed"
                width={120}
                height={32}
                priority
                className="ml-2 h-8 w-auto dark:brightness-0 dark:invert"
              />
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
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-gray-700 hover:text-gray-900 font-medium">
              Products
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-gray-900 font-medium">
              Categories
            </Link>
            
            {/* Cart icon removed from storefront */}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <Link href="/account" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                  <UserIcon className="h-6 w-6" />
                  <span className="font-medium">Account</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="btn-outlined">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn-filled">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Theme Controls */}
            {(process.env.NEXT_PUBLIC_ENABLE_M3 === '1' || process.env.NEXT_PUBLIC_ENABLE_M3 === 'true') && (
              <ThemeControls />
            )}
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
              href="/products"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            {isAuthenticated ? (
              <Link
                href="/account"
                className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserIcon className="h-5 w-5 mr-2" />
                Account
              </Link>
            ) : (
              <div className="space-y-1">
                <Link
                  href="/auth/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-3 py-2 text-base font-medium bg-primary-600 text-white hover:bg-primary-700 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
