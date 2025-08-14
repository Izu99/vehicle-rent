/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  trailingSlash: true // optional if you want folder-style /h/index.html
};

module.exports = nextConfig;
