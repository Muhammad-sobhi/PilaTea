import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/pilatea",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/storage/**" },
      { protocol: "http", hostname: "159.203.35.226", pathname: "/pilatea-api/storage/**" },
    ],
  },
};

export default nextConfig;