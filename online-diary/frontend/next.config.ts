import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {


  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*', 
      },
    ];
  },

  
  webpack: (config) => {

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

   const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.(".svg")
    );

    

    config.module.rules.push(
      // Переиспользуем стандартное правило для SVG, если импорт идет через ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Для всех остальных импортов SVG — используем SVGR
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...(fileLoaderRule.resourceQuery?.not ?? []), /url/] },
        use: ["@svgr/webpack"],
      }
    );

    return config;
  },
};

export default nextConfig;
