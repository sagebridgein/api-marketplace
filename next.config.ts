import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/market",
        destination:
          "https://app.sagebridge.in", // Proxy to Flask Backend
      },
    ];
  },
};

export default nextConfig;
