/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'lh3.googleusercontent.com',
      'firebasestorage.googleapis.com',
      'source.unsplash.com',
    ],
  },
};

module.exports = nextConfig;
