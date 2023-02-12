/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode:true,
  poweredByHeader: false,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qmvirlrqiiehntmvzgdb.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig;