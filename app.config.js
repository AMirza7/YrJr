const packageJson = require("./package.json");

const config = {
  expo: {
    name: "YRJR Legal Assistant",
    slug: "yrjr-legal-assistant",
    version: packageJson.version,
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    assetBundlePatterns: ["**/*"],

    // Performance optimizations
    jsEngine: "hermes",

    // Platform-specific configurations
    ios: {
      bundleIdentifier: "com.yrjr.legalassistant",
      supportsTablet: true,
      // iOS-specific optimizations
      buildNumber: "1",
    },

    android: {
      package: "com.yrjr.legalassistant",
      versionCode: 1,
      // Android-specific optimizations
      enableHermes: true,
      enableProGuardInReleaseBuilds: true,
    },

    web: {
      // Web-specific optimizations
      bundler: "metro",
      output: "static",
      favicon: "./assets/favicon.png",

      // Performance optimizations for web
      build: {
        babel: {
          include: ["@babel/plugin-proposal-export-namespace-from"],
        },
      },

      // Meta tags for SEO and performance
      meta: {
        "theme-color": "#1e40af",
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-status-bar-style": "default",
        viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
      },
    },

    // Plugin configurations (only load what's needed)
    plugins: ["expo-router"],

    // Experimental features for performance (disabled for stability)
    // experiments: {
    //   turboModules: true,
    //   newArchEnabled: true,
    // },

    // Bundle splitting and lazy loading
    extra: {
      enableLazyLoading: true,
      platformSpecificBundles: true,
    },
  },
};

// Platform-specific plugin loading
if (process.env.EXPO_PLATFORM !== "web") {
  // Add mobile-only plugins
  config.expo.plugins.push("expo-secure-store", "expo-local-authentication", [
    "expo-camera",
    {
      cameraPermission: "Allow YRJR to access your camera to scan documents.",
    },
  ]);
}

module.exports = config;
