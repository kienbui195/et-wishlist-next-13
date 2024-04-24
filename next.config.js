/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["127.0.0.1", "https://etwadmin.lotusa.net"],
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "etwadmin.lotusa.net",
    //   },
    // ],
  },
};

module.exports = nextConfig;
