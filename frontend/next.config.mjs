/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'], // dodaj tutaj hosty, z których będą ładowane obrazy
  },
};

export default nextConfig;
