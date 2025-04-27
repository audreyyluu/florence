/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
  // Enable static page generation for applicable routes
  staticPageGenerationTimeout: 120,
  reactStrictMode: true,
  swcMinify: true,
  // Enable Link component prefetching by default
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  }
}

export default nextConfig 