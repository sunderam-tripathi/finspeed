'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, ShoppingBagIcon, TagIcon, UsersIcon, CogIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Products', href: '/products', icon: ShoppingBagIcon },
  { name: 'Categories', href: '/categories', icon: TagIcon },
  { name: 'Users', href: '/users', icon: UsersIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Finspeed Admin</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={`/admin${item.href}`}
            className={classNames(
              pathname.startsWith(`/admin${item.href}`) ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
            )}
          >
            <item.icon
              className={classNames(
                pathname.startsWith(`/admin${item.href}`) ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                'mr-3 flex-shrink-0 h-6 w-6'
              )}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
