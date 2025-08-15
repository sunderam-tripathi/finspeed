/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Configure images
  images: {
    unoptimized: true, // Disable default Image Optimization API
    domains: [
      'localhost',
      'staging.finspeed.online',
      'finspeed.online',
      'finspeed-frontend-staging-487758456202.asia-south2.run.app'
    ],
  },
  
  // Environment variables
  env: {
    // Leave empty by default; client code falls back to same-origin '/api/v1'
    NEXT_PUBLIC_API_URL: process.env.API_URL || '',
    NEXT_PUBLIC_ENVIRONMENT: process.env.ENVIRONMENT || 'development',
  },
  
  // Configure headers (only for non-export)
  async headers() {
    if (process.env.NODE_ENV === 'production' && process.env.OUTPUT === 'export') {
      return [];
    }
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Important: return the modified config
    return config;
  },
  
  // Configure page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Add trailing slash for better static export compatibility
  trailingSlash: false,
  
  // Enable React 18 concurrent features
  experimental: {
    serverActions: true,
  },
};

// Only enable the following in production
if (process.env.NODE_ENV === 'production') {
  // Add production-specific configurations here
  nextConfig.poweredByHeader = false;
  nextConfig.generateEtags = true;
  nextConfig.compress = true;
  
  // Enable standalone output for production
  nextConfig.output = 'standalone';
  
  // Disable static export for now to avoid issues with dynamic routes
  // nextConfig.output = 'export';
}

module.exports = nextConfig;
