import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // IMPORTANT: Toggle based on your use case
  // 
  // For DEVELOPMENT (localhost with middleware & auth):
  //   - Keep output: 'export' COMMENTED OUT (as shown below)
  //   - This enables middleware for proper auth session management
  //
  // For MOBILE BUILD (Capacitor):
  //   - UNCOMMENT output: 'export' 
  //   - Auth will work via Capacitor storage (no middleware needed)
  //   - Run: npm run build && npx cap sync
  //
  output: 'export',  // ENABLED FOR MOBILE BUILD (iOS App Store submission)
  
  // Exclude backup folders and allow dynamic routes
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Skip dynamic routes for static export - they'll work client-side in Capacitor
  trailingSlash: true,
  
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
