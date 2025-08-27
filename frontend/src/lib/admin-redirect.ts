// Admin domain redirect utilities for cross-domain authentication

export interface AdminRedirectConfig {
  adminDomain: string;
  currentDomain: string;
}

/**
 * Get the admin domain URL based on current environment
 */
export function getAdminDomain(): string {
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development';
  
  switch (environment) {
    case 'production':
      return 'https://admin.finspeed.online';
    case 'staging':
      return 'https://admin.staging.finspeed.online';
    default:
      return 'http://localhost:3001';
  }
}

/**
 * Get the current frontend domain
 */
export function getCurrentDomain(): string {
  if (typeof window === 'undefined') return '';
  return window.location.origin;
}

/**
 * Redirect to admin dashboard with authentication token
 */
export function redirectToAdmin(token?: string): void {
  const adminDomain = getAdminDomain();
  const authToken = token || localStorage.getItem('finspeed_token');
  
  if (authToken) {
    // Pass token via URL parameter for cross-domain authentication
    const adminUrl = `${adminDomain}?token=${encodeURIComponent(authToken)}`;
    window.open(adminUrl, '_blank');
  } else {
    // Redirect to admin domain for authentication
    window.open(adminDomain, '_blank');
  }
}

/**
 * Check if current user has admin role
 */
export async function isAdminUser(): Promise<boolean> {
  try {
    const token = localStorage.getItem('finspeed_token');
    if (!token) return false;
    
    // Decode JWT to check role (basic implementation)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'admin';
  } catch (error) {
    console.error('Failed to check admin role:', error);
    return false;
  }
}
