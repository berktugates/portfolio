import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  output: "export",
  
  images: {
    unoptimized: true
  },
  

};

export default nextConfig;