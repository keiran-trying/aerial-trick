import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aerialtrick.app',
  appName: 'Aerial Tricks',
  webDir: 'out',
  server: {
    // Clear text traffic for local development
    androidScheme: 'https',
    iosScheme: 'ionic',
  },
  plugins: {
    // Ensure keyboard doesn't push content
    Keyboard: {
      resize: 'body',
    },
    // Status bar configuration for safe areas
    StatusBar: {
      style: 'light',
      backgroundColor: '#ffffff',
    },
  },
};

export default config;
