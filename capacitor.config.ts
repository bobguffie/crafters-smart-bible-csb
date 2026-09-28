import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.crafterssmartbible.csb',
  appName: 'Crafters Smart Bible',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
