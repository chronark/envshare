/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["twitter.com", "pbs.twimg.com"],
  },
};

module.exports = nextConfig;
