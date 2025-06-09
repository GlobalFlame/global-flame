/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['http://localhost:3000', 'http://192.168.1.147:3000'],
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
