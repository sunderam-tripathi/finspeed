'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBagIcon, UserIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { apiClient, Cart } from '@/lib/api';
import ThemeControls from '@/components/ThemeControls';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      // Check authentication status
      setIsAuthenticated(apiClient.isAuthenticated());
      
      // Load cart
      loadCart();
    } catch (error) {
      console.error('Failed to initialize header:', error);
    }
  }, []);

  const loadCart = async () => {
    try {
      const cartData = await apiClient.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Failed to load cart:', error);
      // Set empty cart to prevent UI issues
      setCart({ items: [], count: 0, subtotal: 0, total: 0 });
    }
  };

  return (
    <header className="top-app-bar md-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/brand/logo.svg"
                alt="Finspeed"
                width={28}
                height={28}
                priority
              />
              <span className="ml-2 text-2xl font-heading font-black uppercase">Finspeed</span>
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
            
            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-gray-900">
              <ShoppingBagIcon className="h-6 w-6" />
              {cart && cart.count > 0 && (
                <span className="absolute -top-1 -right-1 bg-[color:var(--md-sys-color-primary)] text-[color:var(--md-sys-color-on-primary)] text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.count}
                </span>
              )}
            </Link>

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
            <Link
              href="/cart"
              className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingBagIcon className="h-5 w-5 mr-2" />
              Cart {cart && cart.count > 0 && `(${cart.count})`}
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
