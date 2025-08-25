'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to products page since cart functionality is removed
    router.push('/products');
  }, [router]);

  return null;
}
