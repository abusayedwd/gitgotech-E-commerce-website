import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    SOCKET_BASE_URL: process.env.SOCKET_BASE_URL,
  },
};

export default nextConfig;
