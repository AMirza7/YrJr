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
    },

    android: {
      package: "com.yrjr.legalassistant",
      versionCode: 1,
      enableHermes: true,
    },

    web: {
      bundler: "metro",
      favicon: "./assets/favicon.png",
    },

    // Only essential plugins
    plugins: ["expo-router"],
  },
};
