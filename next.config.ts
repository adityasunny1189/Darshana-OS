import type { NextConfig } from "next";

// Frontend-only: everything is pre-rendered to static HTML in `out/`.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
