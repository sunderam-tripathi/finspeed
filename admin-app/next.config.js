/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Configure images
  images: {
    domains: [
      'localhost',
      'staging.finspeed.online',
      'finspeed.online',
      'finspeed-frontend-staging-487758456202.asia-south2.run.app'
    ],
  },
  
  // Environment variables
  
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
};

// Only enable the following in production
if (process.env.NODE_ENV === 'production') {
  // Add production-specific configurations here
  nextConfig.poweredByHeader = false;
  nextConfig.generateEtags = true;
  nextConfig.compress = true;
  
  // Admin app always uses standalone output for Cloud Run
  nextConfig.output = 'standalone';
}

module.exports = nextConfig;
