'use client';

import { useRouter } from 'next/navigation';
import { ShoppingBagIcon, UserGroupIcon, ChartBarIcon, CogIcon, SwatchIcon } from '@heroicons/react/24/outline';

export default function AdminPage() {
  const router = useRouter();
  
  const stats = [
    { name: 'Total Products', value: '24', change: '+12%', changeType: 'increase' },
    { name: 'Active Orders', value: '8', change: '+2', changeType: 'neutral' },
    { name: 'Total Users', value: '142', change: '+5%', changeType: 'increase' },
    { name: 'Revenue (30d)', value: '$12,340', change: '+8.2%', changeType: 'increase' },
  ];

  const quickActions = [
    { name: 'Add Product', href: '/admin/products/new', icon: ShoppingBagIcon },
    { name: 'View Orders', href: '/admin/orders', icon: ShoppingBagIcon },
    { name: 'Manage Users', href: '/admin/users', icon: UserGroupIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/admin/settings', icon: CogIcon },
  ];

  return (
    <div className="min-h-screen bg-[color:var(--md-sys-color-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-[color:var(--md-sys-color-on-surface)]">
                Dashboard
              </h1>
              <p className="mt-2 text-[color:var(--md-sys-color-on-surface-variant)]">
                Welcome back! Here's what's happening with your store.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                type="button"
                onClick={() => router.push('/admin/demo')}
                className="inline-flex items-center rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
                           bg-[color:var(--md-sys-color-primary)] text-[color:var(--md-sys-color-on-primary)] focus:ring-[color:var(--md-sys-color-primary)]
                           hover:opacity-90"
                aria-label="Open Theme Demo"
              >
                <SwatchIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Theme Demo
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div 
              key={stat.name}
              className="md-surface-container-highest rounded-xl p-6 shadow-sm"
            >
              <dt className="text-sm font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
                {stat.name}
              </dt>
              <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                <div className="flex items-baseline text-2xl font-semibold text-[color:var(--md-sys-color-on-surface)]">
                  {stat.value}
                  <span className={`ml-2 text-sm font-medium ${
                    stat.changeType === 'increase' 
                      ? 'text-green-600' 
                      : stat.changeType === 'decrease' 
                        ? 'text-red-600' 
                        : 'text-gray-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </dd>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-[color:var(--md-sys-color-on-surface)] mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.name}
                  onClick={() => router.push(action.href)}
                  className="relative flex items-center space-x-3 rounded-lg border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-[color:var(--md-sys-color-primary)] hover:border-[color:var(--md-sys-color-outline)] cursor-pointer"
                >
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-[color:var(--md-sys-color-primary)]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-[color:var(--md-sys-color-on-surface)]">
                      {action.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg md-surface-container-highest shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-[color:var(--md-sys-color-outline-variant)]">
            <h3 className="text-lg font-medium leading-6 text-[color:var(--md-sys-color-on-surface)]">
              Recent Activity
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
              No recent activity to display.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
