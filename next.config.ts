import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  async redirects() {
    // every legacy host permanently forwards to the canonical zakezhang.com
    const legacyHosts = [
      "zake-site.vercel.app",
      "zakezhang.vercel.app",
      "www.zakezhang.com",
    ];
    return legacyHosts.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: "https://zakezhang.com/:path*",
      permanent: true,
    }));
  },
};

export default nextConfig;
