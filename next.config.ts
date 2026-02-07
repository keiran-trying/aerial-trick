import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // IMPORTANT: For iOS build this must be 'export'
  // For web/admin access, comment out the output line
  output: 'export',  // ENABLED FOR MOBILE BUILD
  
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  trailingSlash: true,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
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
