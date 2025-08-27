"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircleIcon, XCircleIcon, ClockIcon, TruckIcon } from "@heroicons/react/24/outline";
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
      case 'pending':
        return <ClockIcon className="h-6 w-6 text-yellow-600" />;
      case 'shipped':
        return <TruckIcon className="h-6 w-6 text-blue-600" />;
      case 'cancelled':
      case 'payment_failed':
        return <XCircleIcon className="h-6 w-6 text-red-600" />;
      default:
        return <ClockIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'shipped':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'cancelled':
      case 'payment_failed':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="md-card p-6 text-center">
            <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/orders" className="btn-filled">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Banner */}
        {success && (
          <div className="mb-8 md-card p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <h2 className="text-xl font-semibold text-green-900">Order Confirmed!</h2>
                <p className="text-green-700 mt-1">Thank you for your purchase. Your order has been successfully placed.</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Header */}
        <div className="md-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
            <div className={`flex items-center px-3 py-2 rounded-full border ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="ml-2 font-medium capitalize">{order.status.replace('_', ' ')}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Order Date</p>
              <p className="font-medium">{new Date(order.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Total Amount</p>
              <p className="font-medium text-lg">{new Intl.NumberFormat("en-IN", { 
                style: "currency", 
                currency: "INR" 
              }).format(order.total)}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Items</p>
              <p className="font-medium">{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="md-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                      {item.product?.images?.[0] ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900">{item.product?.title || 'Product'}</h4>
                      <p className="text-sm text-gray-500">Quantity: {item.qty}</p>
                      <p className="text-sm text-gray-500">Price: {new Intl.NumberFormat("en-IN", { 
                        style: "currency", 
                        currency: "INR" 
                      }).format(item.price_each)}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {new Intl.NumberFormat("en-IN", { 
                          style: "currency", 
                          currency: "INR" 
                        }).format(item.price_each * item.qty)}
                      </p>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 text-center py-4">No items found</p>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary & Shipping */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="md-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{new Intl.NumberFormat("en-IN", { 
                    style: "currency", 
                    currency: "INR" 
                  }).format(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {order.shipping_fee === 0 ? 'Free' : new Intl.NumberFormat("en-IN", { 
                      style: "currency", 
                      currency: "INR" 
                    }).format(order.shipping_fee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{new Intl.NumberFormat("en-IN", { 
                    style: "currency", 
                    currency: "INR" 
                  }).format(order.tax_amount)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{new Intl.NumberFormat("en-IN", { 
                      style: "currency", 
                      currency: "INR" 
                    }).format(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="md-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{order.shipping_address.name}</p>
                <p>{order.shipping_address.address1}</p>
                {order.shipping_address.address2 && <p>{order.shipping_address.address2}</p>}
                <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}</p>
                <p>{order.shipping_address.country}</p>
                <p className="pt-2">Phone: {order.shipping_address.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/orders" className="btn-outlined">
            View All Orders
          </Link>
          <Link href="/products" className="btn-filled">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
