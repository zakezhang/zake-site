import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  async redirects() {
    return [
      // Legacy Vercel domain permanently forwards to the canonical one
      {
        source: "/:path*",
        has: [{ type: "host", value: "zake-site.vercel.app" }],
        destination: "https://zakezhang.vercel.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
