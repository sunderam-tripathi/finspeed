'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

/**
 * Component to handle cross-domain authentication tokens
 * Processes tokens passed via URL parameters from frontend redirects
 */
export default function TokenHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const from = searchParams.get('from');

    if (token) {
      try {
        // Decode and validate the token
        const decoded: { user_id: number; email: string; role: string; exp: number } = jwtDecode(token);
        
        // Check if token is valid and user is admin
        if (decoded.exp * 1000 > Date.now() && decoded.role === 'admin') {
          // Store token in localStorage for admin app
          localStorage.setItem('finspeed_token', token);
          
          // Clean up URL by removing token parameters
          const url = new URL(window.location.href);
          url.searchParams.delete('token');
          url.searchParams.delete('from');
          
          // Replace current URL without token in history
          window.history.replaceState({}, '', url.toString());
          
          // Trigger a page reload to initialize auth context with new token
          window.location.reload();
        } else {
          console.error('Invalid or expired token, or user is not admin');
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        router.push('/admin/login');
      }
    }
  }, [searchParams, router]);

  // Show loading state while processing token
  if (searchParams.get('token')) {
    return (
      <div className="min-h-screen bg-[color:var(--md-sys-color-surface)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--md-sys-color-primary)] mx-auto mb-4"></div>
          <p className="text-[color:var(--md-sys-color-on-surface)]">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  return null;
}
