import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  devIndicators: {
    appIsrStatus: false,
  },
};

export default nextConfig;
