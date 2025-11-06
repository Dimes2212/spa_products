import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;


/** @type {import('next').NextConfig} */
const isGH = process.env.GH_PAGES === '1'
const repo = 'spa_products' // ← ЗАМЕНИ на имя твоего репозитория

module.exports = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isGH ? `/${repo}` : '',
  assetPrefix: isGH ? `/${repo}/` : '',
}