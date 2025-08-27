'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/api';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: product.currency || 'INR',
  }).format(product.price);

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Product Image */}
        <div className="aspect-square relative bg-gray-100">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          {/* Stock indicator */}
          {product.stock_qty <= 5 && product.stock_qty > 0 && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
              Only {product.stock_qty} left
            </div>
          )}
          
          {product.stock_qty === 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Out of Stock
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {product.title}
              </h3>
              
              {product.category && (
                <p className="text-sm text-gray-500 mt-1">
                  {product.category.name}
                </p>
              )}
              
              <div className="mt-2">
                <span className="text-xl font-bold text-gray-900">
                  {formattedPrice}
                </span>
                {product.sku && (
                  <span className="text-sm text-gray-500 ml-2">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              {/* Key specs preview */}
              {product.specs && (
                <div className="mt-2 text-sm text-gray-600">
                  {product.specs.frame && (
                    <span className="inline-block mr-3">
                      Frame: {product.specs.frame}
                    </span>
                  )}
                  {product.specs.weight && (
                    <span className="inline-block">
                      Weight: {product.specs.weight}
                    </span>
                  )}
                </div>
              )}

              {/* Warranty */}
              {product.warranty_months && (
                <div className="mt-2 text-sm text-green-600">
                  {product.warranty_months} months warranty
                </div>
              )}
            </div>
          </div>

          {/* Admin Actions */}
          <div className="mt-4 space-y-2">
            <Link
              href={`/admin/products/edit/${product.id}`}
              className="block w-full text-center py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium"
            >
              Edit
            </Link>
            <div className="text-xs text-gray-500 text-center">
              Stock: {product.stock_qty} | SKU: {product.sku || 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
