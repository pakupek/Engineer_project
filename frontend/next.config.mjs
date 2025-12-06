/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "dev-backend",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      }
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', 
    },
  },
};

export default nextConfig;
