/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      }
    ],
  },
  // transpilePackages removed — three.js dependency dropped
  async rewrites() {
    return [
      { source: "/hero", destination: "/" },
      { source: "/about", destination: "/" },
      { source: "/showcase", destination: "/" },
      { source: "/community", destination: "/" },
      { source: "/tech", destination: "/" },
      { source: "/contact", destination: "/" },
    ];
  },
};

export default nextConfig;
