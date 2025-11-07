import type { NextConfig } from 'next';

const repo = 'spa_products';
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : '',
  // trailingSlash: true, // опционально
};

export default nextConfig;
