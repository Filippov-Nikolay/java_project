import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // алиасы
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@app": path.resolve(__dirname, "src/app"),
      "@entities": path.resolve(__dirname, "src/entities"),
      "@features": path.resolve(__dirname, "src/features"),
      "@widgets": path.resolve(__dirname, "src/widgets"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@shared/ui": path.resolve(__dirname, "src/shared/ui"),
      "@shared/lib": path.resolve(__dirname, "src/shared/lib"),
      "@shared/hooks": path.resolve(__dirname, "src/shared/hooks"),
      "@shared/styles": path.resolve(__dirname, "src/shared/styles"),
      "@config": path.resolve(__dirname, "src/shared/config"),
    };

    // 🔹 вот это добавляем для SVGR
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
