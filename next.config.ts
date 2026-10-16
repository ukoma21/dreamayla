import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  async rewrites() {
    return [
      { source: "/dreams/falling", destination: "/poop" },
      { source: "/dreams/:slug", destination: "/dream-detail/:slug" },
    ];
  },
};
export default nextConfig;
