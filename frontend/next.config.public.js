/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Configure images for static export
  images: {
    unoptimized: true,
    domains: [
      'localhost',
      'staging.finspeed.online',
      'finspeed.online',
    ],
  },
  
  // Static export configuration
  output: 'export',
  trailingSlash: true,
  
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
  
  // Exclude admin routes from static build
  async generateStaticParams() {
    return [];
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
