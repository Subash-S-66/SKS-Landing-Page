/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: ['via.placeholder.com', 'res.cloudinary.com'],
  },
}

module.exports = nextConfig
