import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { nextRuntime, webpack }) => {
    if (nextRuntime === 'edge') {
      // ponytail: force dead-code elimination of setup-node-env.external in Edge bundle
      // webpack ne remplace pas process.env.NEXT_RUNTIME dans le bundle edge de Next.js 16,
      // ce qui fait que le shim Node.js (setup-node-env.external) reste bundlé et injecte
      // __dirname — non disponible dans l'Edge Runtime.
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NEXT_RUNTIME': JSON.stringify('edge'),
        })
      );
    }
    return config;
  },
};

export default nextConfig;
