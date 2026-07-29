import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Explicitly set the workspace root to this directory to resolve Turbopack module resolution locks
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
