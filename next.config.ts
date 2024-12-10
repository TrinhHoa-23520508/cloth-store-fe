import { NextConfig } from 'next';
import { createProxyMiddleware } from 'http-proxy-middleware';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Định tuyến các request đến /api/*
        destination: 'http://localhost:8000/:path*', // Chuyển tiếp tới backend
      },
    ];
  },
};

export default nextConfig;
