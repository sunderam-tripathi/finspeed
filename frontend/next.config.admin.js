/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Configure images
  images: {
    unoptimized: true,
    domains: [
      'localhost',
      'staging.finspeed.online',
      'finspeed.online',
      'admin.finspeed.online',
    ],
  },
  
  // Standalone output for Cloud Run
  output: 'standalone',
  trailingSlash: false,
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Configure page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Production settings
  poweredByHeader: false,
  generateEtags: true,
  compress: true,
  
  // Enable React 18 concurrent features
  experimental: {
    serverActions: true,
  },
  
  async headers() {
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
};

module.exports = nextConfig;
