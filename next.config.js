/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  distDir: 'out',
  trailingSlash: false,
  compress: true,
  swcMinify: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? './' : '',
  experimental: {
    outputFileTracingRoot: process.env.NODE_ENV === 'production' ? process.cwd() : undefined,
  },
  webpack: (config, { isServer }) => {
    // Ensure proper MIME types for JavaScript modules
    config.module.rules.push({
      test: /\.js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false
      }
    });
    return config;
  }
}

module.exports = nextConfig
