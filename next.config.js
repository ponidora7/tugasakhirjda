/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  // Hapus experimental.serverActions karena sudah deprecated di Next.js 14
  // serverActions sudah stable dan tidak perlu flag experimental lagi
}

module.exports = nextConfig