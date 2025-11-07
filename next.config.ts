// const repo = 'spa_products';
// const isProd = process.env.NODE_ENV === 'production';
// module.exports = {
//   output: 'export',
//   basePath: isProd ? `/${repo}` : '',
//   assetPrefix: isProd ? `/${repo}/` : '',
//   images: { unoptimized: true },
// };

import type { NextConfig } from 'next';

const repo = 'spa_products';
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : '',
  // опционально:
  // trailingSlash: true,
};

export default nextConfig;
