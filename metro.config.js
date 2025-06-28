const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Platform-specific optimizations
config.resolver.platforms = ["native", "ios", "android", "web"];

// Exclude heavy packages from web builds
if (process.env.EXPO_PLATFORM === "web") {
  config.resolver.blockList = [
    /node_modules\/expo-camera/,
    /node_modules\/expo-local-authentication/,
    /node_modules\/expo-secure-store/,
    /node_modules\/expo-media-library/,
    /node_modules\/expo-sms/,
    /node_modules\/expo-speech/,
    /node_modules\/react-native-razorpay/,
    /node_modules\/lottie-react-native/,
  ];
}

// Optimize bundle splitting
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    mangle: {
      keep_fnames: true,
    },
    output: {
      comments: false,
    },
  },
};

// Enable tree shaking
config.resolver.enableHermes = true;

// Cache optimizations
config.cacheStores = [
  {
    name: "FileStore",
    options: {
      cacheDirectory: ".metro-cache",
    },
  },
];

// Source map optimizations for production
if (process.env.NODE_ENV === "production") {
  config.transformer.sourceMap = {
    development: false,
    production: true,
  };
}

module.exports = config;
