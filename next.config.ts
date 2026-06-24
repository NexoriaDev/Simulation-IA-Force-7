import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config, { webpack }) => {
    // ponytail: webpack n'injecte pas __dirname dans le bundle Edge de Vercel.
    // BannerPlugin le définit en tête de TOUS les bundles (safe — var est no-op
    // si déjà défini en Node.js, et fix pour l'Edge Runtime où il est absent).
    config.plugins.push(
      new webpack.BannerPlugin({
        banner: 'var __dirname=typeof __dirname!=="undefined"?__dirname:"/",__filename=typeof __filename!=="undefined"?__filename:"";',
        raw: true,
        entryOnly: false,
      })
    );
    return config;
  },
};

export default nextConfig;
