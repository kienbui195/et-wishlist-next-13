/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["127.0.0.1", "https://etwadmin.lotusa.net"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    loader: 'default'
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "etwadmin.lotusa.net",
    //   },
    // ],
  },
};

module.exports = nextConfig;
