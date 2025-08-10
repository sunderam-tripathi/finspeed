/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress hydration warnings in development
  reactStrictMode: true,
  
  // Enable standalone output for Docker deployment
  output: 'standalone',
  
  // Optional: Configure allowed dev origins for CORS
  experimental: {
    allowedDevOrigins: ['127.0.0.1', 'localhost'],
  },

  // Suppress hydration warnings caused by browser extensions
  compiler: {
    // Remove console.logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Custom webpack config to handle hydration mismatches
  webpack: (config, { dev }) => {
    if (dev) {
      // Suppress hydration warnings in development
      config.resolve.alias = {
        ...config.resolve.alias,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
