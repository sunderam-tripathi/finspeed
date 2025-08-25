"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiClient, Order } from "@/lib/api";

declare global {
  interface Window {
    Razorpay: any;
  }
}

async function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const orderIdParam = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params?.id[0] : undefined;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

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

  const payNow = async () => {
    if (!order) return;
    setPayError(null);
    try {
      setPaying(true);
      const rzp = await apiClient.createRazorpayOrder(order.id);
      const ok = await loadRazorpayScript();
      if (!ok || typeof window === 'undefined' || !window.Razorpay) {
        setPayError('Failed to load Razorpay checkout.');
        setPaying(false);
        return;
      }

      const options = {
        key: rzp.key_id,
        amount: rzp.amount,
        currency: rzp.currency,
        name: 'Finspeed',
        description: `Pay for Order #${order.id}`,
        order_id: rzp.razorpay_order_id,
        prefill: {
          name: order.shipping_address?.name,
          contact: order.shipping_address?.phone,
        },
        notes: { order_id: order.id.toString() },
        handler: async (response: any) => {
          try {
            await apiClient.verifyRazorpayPayment({
              order_id: order.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            router.push(`/orders/${order.id}?success=1`);
          } catch (e: any) {
            setPayError(e?.message || 'Payment verification failed');
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
            setPayError('Payment cancelled. You can retry anytime.');
          },
        },
        retry: { enabled: true, max_count: 1 },
        theme: { color: '#0ea5a1' },
      } as any;

      const rz = new window.Razorpay(options);
      if (rz?.on) {
        rz.on('payment.failed', (resp: any) => {
          setPayError(resp?.error?.description || 'Payment failed. Please try again.');
          setPaying(false);
        });
      }
      rz.open();
    } catch (e: any) {
      setPayError(e?.message || 'Unable to start payment');
      setPaying(false);
    }
  };

  const successParam = searchParams.get("success");
  const success = successParam === "true" || successParam === "1";
  const cancelledParam = searchParams.get("cancel");
  const cancelled = cancelledParam === "true" || cancelledParam === "1";
  const failedParam = searchParams.get("failed");
  const failed = failedParam === "true" || failedParam === "1";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
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
        <div className="card">
          <h1 className="text-2xl font-semibold text-gray-900">Order #{order.id}</h1>
          {success && (
            <div className="mt-3 p-3 rounded border border-green-200 bg-green-50 text-green-700 text-sm">
              Payment successful. Thank you for your purchase!
            </div>
          )}
          {cancelled && (
            <div className="mt-3 p-3 rounded border border-yellow-200 bg-yellow-50 text-yellow-800 text-sm">
              Payment cancelled. You can retry anytime.
            </div>
          )}
          {failed && (
            <div className="mt-3 p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">
              Payment failed. Please try again.
            </div>
          )}
          {!success && order.status === 'pending' && (
            <div className="mt-3 p-3 rounded border border-yellow-200 bg-yellow-50 text-yellow-800 text-sm">
              Payment pending. Complete your payment to confirm this order.
            </div>
          )}
          {payError && (
            <div className="mt-3 p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">{payError}</div>
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

          {order.status === 'pending' && (
            <div className="mt-6">
              <button onClick={payNow} disabled={paying} className="btn btn-primary px-4 py-2 rounded disabled:opacity-50">
                {paying ? 'Opening Checkout…' : 'Pay Now'}
              </button>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <Link href="/orders" className="btn px-4 py-2 rounded border">My Orders</Link>
            <Link href="/" className="btn btn-secondary px-4 py-2 rounded">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
