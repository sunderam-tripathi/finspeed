'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { apiClient, Product } from '@/lib/api';

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

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const router = useRouter();
  const [showCheckout, setShowCheckout] = useState(false);
  const [shipping, setShipping] = useState<{
    name: string;
    phone: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  }>({ name: '', phone: '', address1: '', address2: '', city: '', state: '', pincode: '', country: 'India' });
  const [qty, setQty] = useState<number>(1);
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await apiClient.getProduct(slug);
      setProduct(productData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!apiClient.isAuthenticated()) {
      router.push(`/auth/login?redirect=/products/${slug}`);
      return;
    }
    setShowCheckout(true);
    setPayError(null);
  };

  const startPayment = async () => {
    if (!product) return;
    setPayError(null);
    // stronger validation
    const phoneValid = /^[6-9]\d{9}$/.test(shipping.phone.trim());
    const pincodeValid = /^[1-9]\d{5}$/.test(shipping.pincode.trim());
    const nameValid = shipping.name.trim().length >= 2;
    const addrValid = shipping.address1.trim().length >= 6;
    const cityValid = shipping.city.trim().length >= 2;
    const stateValid = shipping.state.trim().length >= 2;
    const qtyNum = Number(qty);
    const qtyValid = Number.isInteger(qtyNum) && qtyNum >= 1 && qtyNum <= (product.stock_qty || 1);
    if (!nameValid || !phoneValid || !addrValid || !cityValid || !stateValid || !pincodeValid || !qtyValid) {
      const msgs: string[] = [];
      if (!nameValid) msgs.push('name');
      if (!phoneValid) msgs.push('phone');
      if (!addrValid) msgs.push('address');
      if (!cityValid) msgs.push('city');
      if (!stateValid) msgs.push('state');
      if (!pincodeValid) msgs.push('pincode');
      if (!qtyValid) msgs.push('quantity');
      setPayError(`Please correct: ${msgs.join(', ')}.`);
      return;
    }

    try {
      setIsPaying(true);
      // 1) Create order (qty fixed to 1 for Buy Now)
      const orderResp = await apiClient.createOrder(
        [{ product_id: product.id, qty: qtyNum }],
        {
          name: shipping.name,
          phone: shipping.phone,
          address1: shipping.address1,
          address2: shipping.address2 || '',
          city: shipping.city,
          state: shipping.state,
          pincode: shipping.pincode,
          country: shipping.country || 'India',
        }
      );

      // Persist order id for retry/links
      setCurrentOrderId(orderResp.order_id);

      // 2) Create Razorpay order
      const rzp = await apiClient.createRazorpayOrder(orderResp.order_id);

      // 3) Load Razorpay script
      const ok = await loadRazorpayScript();
      if (!ok || typeof window === 'undefined' || !window.Razorpay) {
        setPayError('Failed to load Razorpay checkout.');
        setIsPaying(false);
        return;
      }

      const options = {
        key: rzp.key_id,
        amount: rzp.amount,
        currency: rzp.currency,
        name: 'Finspeed',
        description: product.title,
        order_id: rzp.razorpay_order_id,
        prefill: {
          name: shipping.name,
          contact: shipping.phone,
        },
        notes: { order_id: orderResp.order_id.toString() },
        handler: async (response: any) => {
          try {
            await apiClient.verifyRazorpayPayment({
              order_id: orderResp.order_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            router.push(`/orders/${orderResp.order_id}?success=1`);
          } catch (e: any) {
            setPayError(e?.message || 'Payment verification failed');
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
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
          setIsPaying(false);
        });
      }
      rz.open();
    } catch (e: any) {
      setPayError(e?.message || 'Checkout failed');
      setIsPaying(false);
    } finally {
      // Keep isPaying true while modal open; it will reset on ondismiss or after handler
    }
  };

  // Retry payment for an already created order without recreating it
  const retryPayment = async () => {
    if (!currentOrderId) return;
    setPayError(null);
    try {
      setIsPaying(true);
      const rzp = await apiClient.createRazorpayOrder(currentOrderId);
      const ok = await loadRazorpayScript();
      if (!ok || typeof window === 'undefined' || !window.Razorpay) {
        setPayError('Failed to load Razorpay checkout.');
        setIsPaying(false);
        return;
      }

      const options = {
        key: rzp.key_id,
        amount: rzp.amount,
        currency: rzp.currency,
        name: 'Finspeed',
        description: product?.title,
        order_id: rzp.razorpay_order_id,
        prefill: {
          name: shipping.name,
          contact: shipping.phone,
        },
        notes: { order_id: String(currentOrderId) },
        handler: async (response: any) => {
          try {
            await apiClient.verifyRazorpayPayment({
              order_id: currentOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            router.push(`/orders/${currentOrderId}?success=1`);
          } catch (e: any) {
            setPayError(e?.message || 'Payment verification failed');
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
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
          setIsPaying(false);
        });
      }
      rz.open();
    } catch (e: any) {
      setPayError(e?.message || 'Unable to start payment');
      setIsPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist.'}</p>
          <a href="/products" className="btn-primary">
            Back to Products
          </a>
        </div>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: product.currency || 'INR',
  }).format(product.price);

  const images = product.images || [];
  const currentImage = images[selectedImageIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="text-gray-500 hover:text-gray-700">Home</a></li>
            <li><span className="text-gray-400">/</span></li>
            <li><a href="/products" className="text-gray-500 hover:text-gray-700">Products</a></li>
            {product.category && (
              <>
                <li><span className="text-gray-400">/</span></li>
                <li><span className="text-gray-500">{product.category.name}</span></li>
              </>
            )}
            <li><span className="text-gray-400">/</span></li>
            <li><span className="text-gray-900">{product.title}</span></li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
              {currentImage ? (
                <Image
                  src={currentImage.url}
                  alt={currentImage.alt || product.title}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex space-x-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                      index === selectedImageIndex ? 'border-primary-600' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `${product.title} - Image ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
              {product.category && (
                <p className="text-lg text-gray-600 mt-2">{product.category.name}</p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">{formattedPrice}</span>
              {product.sku && (
                <span className="text-sm text-gray-500">SKU: {product.sku}</span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.stock_qty > 0 ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-medium">
                    {product.stock_qty > 10 ? 'In Stock' : `Only ${product.stock_qty} left`}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-700 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Warranty */}
            {product.warranty_months && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-800 font-medium">
                    {product.warranty_months} months warranty included
                  </span>
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {product.stock_qty > 0 ? (
                  <>
                    <span className="h-3 w-3 rounded-full bg-green-500"></span>
                    <span className="text-green-800 font-medium">
                      In Stock ({product.stock_qty} available)
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500">Out of Stock</span>
                )}
              </div>

            {/* Purchase */}
            {product.stock_qty > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600">Qty</label>
                  <input
                    type="number"
                    min={1}
                    max={product.stock_qty}
                    value={qty}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (Number.isNaN(v)) return;
                      const clamped = Math.max(1, Math.min(product.stock_qty, Math.floor(v)));
                      setQty(clamped);
                    }}
                    className="w-20 border rounded px-3 py-2"
                  />
                  <span className="text-xs text-gray-500">Max {product.stock_qty}</span>
                </div>
                <button
                  onClick={handleBuyNow}
                  className="btn btn-primary px-4 py-2 rounded"
                  disabled={isPaying}
                >
                  Buy Now
                </button>

                {showCheckout && (
                  <div className="card space-y-3">
                    <h3 className="text-lg font-semibold">Shipping Address</h3>
                    {payError && (
                      <div className="p-2 rounded border border-red-200 bg-red-50 text-red-700 text-sm">{payError}</div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Name</label>
                        <input
                          className="w-full border rounded px-3 py-2"
                          value={shipping.name}
                          onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Phone</label>
                        <input
                          className="w-full border rounded px-3 py-2"
                          value={shipping.phone}
                          onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                          placeholder="10-digit mobile"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm text-gray-600 mb-1">Address Line 1</label>
                        <input
                          className="w-full border rounded px-3 py-2"
                          value={shipping.address1}
                          onChange={(e) => setShipping({ ...shipping, address1: e.target.value })}
                          placeholder="House no., Street, Area"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm text-gray-600 mb-1">Address Line 2 (optional)</label>
                        <input
                          className="w-full border rounded px-3 py-2"
                          value={shipping.address2}
                          onChange={(e) => setShipping({ ...shipping, address2: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">City</label>
                        <input
                          className="w-full border rounded px-3 py-2"
                          value={shipping.city}
                          onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">State</label>
                        <input
                          className="w-full border rounded px-3 py-2"
                          value={shipping.state}
                          onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Pincode</label>
                        <input
                          className="w-full border rounded px-3 py-2"
                          value={shipping.pincode}
                          onChange={(e) => setShipping({ ...shipping, pincode: e.target.value })}
                          placeholder="6-digit pincode"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Country</label>
                        <input
                          className="w-full border rounded px-3 py-2"
                          value={shipping.country}
                          onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={startPayment}
                        className="btn btn-primary px-4 py-2 rounded"
                        disabled={isPaying}
                      >
                        {isPaying ? 'Processing...' : 'Place Order & Pay'}
                      </button>
                      <button
                        onClick={() => setShowCheckout(false)}
                        className="btn px-4 py-2 rounded border"
                        disabled={isPaying}
                      >
                        Cancel
                      </button>
                      {payError && currentOrderId && (
                        <>
                          <button
                            onClick={retryPayment}
                            className="btn btn-secondary px-4 py-2 rounded"
                            disabled={isPaying}
                          >
                            Retry Payment
                          </button>
                          <a
                            href={`/orders/${currentOrderId}?cancel=1`}
                            className="btn px-4 py-2 rounded border"
                          >
                            View Order
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            </div>

            {/* Specifications */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                      <span className="text-gray-900 font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
