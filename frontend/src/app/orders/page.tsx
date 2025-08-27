'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient, Order, OrdersResponse } from '@/lib/api';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!apiClient.isAuthenticated()) {
      router.push('/auth/login?redirect=/orders');
      return;
    }
    fetchOrders(page, limit);
  }, [page, limit]);

  const fetchOrders = async (pg: number, lim: number) => {
    try {
      setLoading(true);
      const res: OrdersResponse = await apiClient.getOrders({ page: pg, limit: lim });
      setOrders(res.orders || []);
      setTotal(res.total || 0);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Your Orders</h1>
          <p className="text-gray-600">Track and manage your purchases</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="p-4 rounded border border-red-200 bg-red-50 text-red-700">{error}</div>
        ) : orders.length === 0 ? (
          <div className="card">
            <p className="text-gray-700">You have no orders yet.</p>
            <Link href="/products" className="btn btn-primary mt-4 px-4 py-2 rounded inline-flex">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="card">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-500">Order ID</div>
                    <div className="font-semibold">#{o.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="font-medium capitalize">{o.status}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="font-semibold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(o.total)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Placed on</div>
                    <div className="font-medium">{new Date(o.created_at).toLocaleString()}</div>
                  </div>
                  <div className="sm:text-right">
                    <Link href={`/orders/${o.id}`} className="btn btn-secondary px-3 py-2 rounded inline-flex">
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <button
                  className="btn px-3 py-2 rounded border"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <div className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </div>
                <button
                  className="btn px-3 py-2 rounded border"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
