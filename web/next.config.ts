import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "reflector.network",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
