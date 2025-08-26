'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import {
  ChartBarIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  recentOrders: any[];
  revenueStats: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiClient.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-[color:var(--md-sys-color-surface-container)] rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-[color:var(--md-sys-color-surface-container)] rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[color:var(--md-sys-color-on-surface)] mb-8">Analytics</h1>
        <div className="bg-[color:var(--md-sys-color-error-container)] border border-[color:var(--md-sys-color-error)] rounded-lg p-6">
          <p className="text-[color:var(--md-sys-color-on-error-container)]">Error: {error}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: ShoppingBagIcon,
      color: 'text-[color:var(--md-sys-color-primary)]',
      bgColor: 'bg-[color:var(--md-sys-color-primary-container)]',
    },
    {
      name: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCartIcon,
      color: 'text-[color:var(--md-sys-color-secondary)]',
      bgColor: 'bg-[color:var(--md-sys-color-secondary-container)]',
    },
    {
      name: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: UserGroupIcon,
      color: 'text-[color:var(--md-sys-color-tertiary)]',
      bgColor: 'bg-[color:var(--md-sys-color-tertiary-container)]',
    },
    {
      name: 'Revenue',
      value: `₹${(stats?.revenueStats?.total || 0).toLocaleString()}`,
      icon: CurrencyRupeeIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[color:var(--md-sys-color-on-surface)] mb-2">Analytics Dashboard</h1>
        <p className="text-[color:var(--md-sys-color-on-surface-variant)]">
          Overview of your store performance and key metrics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-[color:var(--md-sys-color-surface-container-highest)] rounded-xl p-6 shadow-sm border border-[color:var(--md-sys-color-outline-variant)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-[color:var(--md-sys-color-on-surface)] mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Growth */}
      {stats?.revenueStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-[color:var(--md-sys-color-surface-container-highest)] rounded-xl p-6 shadow-sm border border-[color:var(--md-sys-color-outline-variant)]">
            <h3 className="text-lg font-semibold text-[color:var(--md-sys-color-on-surface)] mb-4">
              Monthly Revenue
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[color:var(--md-sys-color-on-surface-variant)]">This Month</span>
                <span className="font-semibold text-[color:var(--md-sys-color-on-surface)]">
                  ₹{stats.revenueStats.thisMonth.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[color:var(--md-sys-color-on-surface-variant)]">Last Month</span>
                <span className="font-semibold text-[color:var(--md-sys-color-on-surface)]">
                  ₹{stats.revenueStats.lastMonth.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[color:var(--md-sys-color-outline-variant)]">
                <span className="text-[color:var(--md-sys-color-on-surface-variant)]">Growth</span>
                <div className="flex items-center space-x-1">
                  {stats.revenueStats.growth >= 0 ? (
                    <TrendingUpIcon className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDownIcon className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`font-semibold ${
                    stats.revenueStats.growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats.revenueStats.growth > 0 ? '+' : ''}{stats.revenueStats.growth.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[color:var(--md-sys-color-surface-container-highest)] rounded-xl p-6 shadow-sm border border-[color:var(--md-sys-color-outline-variant)]">
            <h3 className="text-lg font-semibold text-[color:var(--md-sys-color-on-surface)] mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg bg-[color:var(--md-sys-color-surface-container)] hover:bg-[color:var(--md-sys-color-surface-container-high)] border border-[color:var(--md-sys-color-outline-variant)] transition-colors">
                <div className="flex items-center space-x-3">
                  <ChartBarIcon className="h-5 w-5 text-[color:var(--md-sys-color-primary)]" />
                  <span className="text-[color:var(--md-sys-color-on-surface)]">View Detailed Reports</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-[color:var(--md-sys-color-surface-container)] hover:bg-[color:var(--md-sys-color-surface-container-high)] border border-[color:var(--md-sys-color-outline-variant)] transition-colors">
                <div className="flex items-center space-x-3">
                  <ShoppingBagIcon className="h-5 w-5 text-[color:var(--md-sys-color-primary)]" />
                  <span className="text-[color:var(--md-sys-color-on-surface)]">Export Product Data</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      {stats?.recentOrders && stats.recentOrders.length > 0 && (
        <div className="bg-[color:var(--md-sys-color-surface-container-highest)] rounded-xl shadow-sm border border-[color:var(--md-sys-color-outline-variant)]">
          <div className="px-6 py-4 border-b border-[color:var(--md-sys-color-outline-variant)]">
            <h3 className="text-lg font-semibold text-[color:var(--md-sys-color-on-surface)]">
              Recent Orders
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentOrders.slice(0, 5).map((order, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[color:var(--md-sys-color-surface-container)]">
                  <div>
                    <p className="font-medium text-[color:var(--md-sys-color-on-surface)]">
                      Order #{order.id || index + 1}
                    </p>
                    <p className="text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recent'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[color:var(--md-sys-color-on-surface)]">
                      ₹{(order.total || 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
                      {order.status || 'Pending'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
