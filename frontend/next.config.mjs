/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'], // dodaj tutaj hosty, z których będą ładowane obrazy
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', 
    },
  },
};

export default nextConfig;
