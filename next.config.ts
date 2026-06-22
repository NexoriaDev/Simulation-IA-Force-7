import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { nextRuntime, webpack }) => {
    if (nextRuntime === 'edge') {
      // ponytail: webpack injecte __dirname dans les wrappers CJS, non disponible dans l'Edge Runtime.
      // BannerPlugin l'injecte en tête du bundle avant tout module wrapper.
      config.plugins.push(
        new webpack.BannerPlugin({
          banner: 'if(typeof __dirname==="undefined")var __dirname="/";if(typeof __filename==="undefined")var __filename="";',
          raw: true,
          entryOnly: false,
        })
      );
    }
    return config;
  },
};

export default nextConfig;
