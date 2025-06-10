/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['http://localhost:3000', 'http://192.168.1.147:3000'],
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; media-src 'self' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
        }
      ]
    }
  ],
  webpack: (config) => {
    config.cache = {
      ...config.cache,
      type: 'filesystem',
      cacheDirectory: path.resolve(__dirname, '.next/cache/webpack'),
      maxAge: 60000 // 60 seconds
    };
    return config;
  }
};

module.exports = nextConfig;
