import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Cargas masivas Excel (nómina ~200+ filas) no deben truncarse en silencio.
      bodySizeLimit: "12mb",
    },
    // Next 16 proxy buffer (default ~10mb) — alinear con server actions.
    proxyClientMaxBodySize: "12mb",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/aida-public/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
