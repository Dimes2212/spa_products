const repo = 'spa_products';
const isProd = process.env.NODE_ENV === 'production';
module.exports = {
  output: 'export',
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : '',
  images: { unoptimized: true },
};