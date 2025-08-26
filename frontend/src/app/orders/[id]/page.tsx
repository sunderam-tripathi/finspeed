"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiClient, Order } from "@/lib/api";

export default function OrderDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const orderIdParam = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params?.id[0] : undefined;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiClient.isAuthenticated()) {
      router.push(`/auth/login?redirect=/orders/${orderIdParam ?? ''}`);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const id = Number(orderIdParam);
        const data = await apiClient.getOrder(id);
        setOrder(data);
      } catch (e: any) {
        setError(e?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [orderIdParam, router]);

  const successParam = searchParams.get("success");
  const success = successParam === "true" || successParam === "1";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow text-red-600">{error}</div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold text-gray-900">Order #{order.id}</h1>
          {success && (
            <div className="mt-3 p-3 rounded border border-green-200 bg-green-50 text-green-700 text-sm">
              Payment successful. Thank you for your purchase!
            </div>
          )}

          <div className="mt-6 space-y-2 text-gray-700">
            <div>
              <span className="font-medium">Status:</span> {order.status}
            </div>
            <div>
              <span className="font-medium">Total:</span> {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(order.total)}
            </div>
            <div>
              <span className="font-medium">Items:</span> {order.items?.length || 0}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Link href="/orders" className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">My Orders</Link>
            <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
