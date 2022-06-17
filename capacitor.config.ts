import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.siecon.req.app',
  appName: 'siecon-req',
  webDir: 'www',
  bundledWebRuntime: false,
  
  plugins: {
    SplashScreen: {
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      splashFullScreen: true,
      splashImmersive: false,
      spinnerColor: '#383D43',
      launchAutoHide: false,
      backgroundColor: '#000000'

    },
  },
};

export default config;
