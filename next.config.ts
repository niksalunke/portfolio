import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Replace 'portfolio_website' with your EXACT GitHub repository name
  basePath: '/portfolio_website',
  assetPrefix: '/portfolio_website/',
};

export default nextConfig;