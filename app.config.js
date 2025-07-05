const packageJson = require("./package.json");

module.exports = {
  expo: {
    name: "YRJR Legal Assistant",
    slug: "yrjr-legal-assistant",
    version: packageJson.version,
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    assetBundlePatterns: ["**/*"],

    // Essential performance settings
    jsEngine: "hermes",

    ios: {
      bundleIdentifier: "com.yrjr.legalassistant",
      supportsTablet: true,
      buildNumber: "1",
      infoPlist: {
        NSCameraUsageDescription:
          "This app uses the camera to scan documents, barcodes, and QR codes for legal document processing.",
        NSMicrophoneUsageDescription:
          "This app may use the microphone for voice commands and audio recording in legal documentation.",
      },
    },

    android: {
      package: "com.yrjr.legalassistant",
      versionCode: 1,
      enableHermes: true,
      permissions: [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
      ],
    },

    web: {
      bundler: "metro",
      favicon: "./assets/favicon.png",
    },

    // Only essential plugins
    plugins: ["expo-router"],
  },
};
