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
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_ADMIN_USERNAME: "admin",
    NEXT_PUBLIC_ADMIN_PASSWORD: "admin",
  },
};

export default nextConfig;
