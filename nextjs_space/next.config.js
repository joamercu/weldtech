const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../'),
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    // Asegurar que fs y path solo se usen en el servidor
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    
    // Ignorar errores de jsdom durante el build
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    // Ignorar archivos CSS de jsdom que no existen
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    
    return config;
  },
};

module.exports = nextConfig;
