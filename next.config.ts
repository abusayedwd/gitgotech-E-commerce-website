import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    SOCKET_BASE_URL: process.env.SOCKET_BASE_URL,
  },
  allowedDevOrigins: ["10.10.11.118"],
  experimental: {
    // Avoid Windows worker crashes during static generation (Turbopack)
    cpus: 1,
  },
};

export default nextConfig;
