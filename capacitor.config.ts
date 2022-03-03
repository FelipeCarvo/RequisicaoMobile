import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'poliview',
  webDir: 'www',
  bundledWebRuntime: false,
  
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#EB5757",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "red",
      layoutName: "launch_screen",

    },
  },
};

export default config;
