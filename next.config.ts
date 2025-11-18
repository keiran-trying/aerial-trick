import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: Static export is needed for Capacitor mobile builds
  // For development, this can be commented out
  output: 'export',
  
  // Skip ESLint during builds for now
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Skip TypeScript checks during builds
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    // Disable image optimization for static export
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
