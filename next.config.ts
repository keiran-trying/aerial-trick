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
  // output: 'export',  // COMMENTED OUT FOR WEB DEPLOYMENT (Vercel/production)
  
  // Exclude backup folders from build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
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
