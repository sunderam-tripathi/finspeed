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
 * Open admin domain in new tab with token for seamless authentication
 */
export function openAdminDomainInNewTab(token: string, redirectPath: string = '/admin'): void {
  const adminDomain = getAdminDomain();
  
  // Create URL with token as query parameter for seamless login
  const adminUrl = new URL(redirectPath, adminDomain);
  adminUrl.searchParams.set('token', token);
  adminUrl.searchParams.set('from', getCurrentDomain());
  
  // Open admin domain in new tab
  window.open(adminUrl.toString(), '_blank');
}

/**
 * Check if current domain is admin domain
 */
export function isAdminDomain(): boolean {
  if (typeof window === 'undefined') return false;
  const currentOrigin = window.location.origin;
  const adminDomain = getAdminDomain();
  return currentOrigin === adminDomain;
}
