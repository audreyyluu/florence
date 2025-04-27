/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
  // Enable static page generation for applicable routes
  staticPageGenerationTimeout: 120,
}

module.exports = nextConfig 