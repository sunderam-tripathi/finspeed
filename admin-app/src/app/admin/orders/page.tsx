'use client';

export default function OrdersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-[color:var(--md-sys-color-on-surface)] mb-4">Orders</h1>
      <div className="md-surface-container-highest rounded-lg p-6">
        <p className="text-[color:var(--md-sys-color-on-surface-variant)]">No orders to display.</p>
      </div>
    </div>
  );
}
