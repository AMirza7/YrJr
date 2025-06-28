import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { router } from "expo-router";
import { storage } from "@/services/storage";

export default function Index() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.3));
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure layout is mounted
    const timer = setTimeout(() => {
      setIsReady(true);
      startAnimations();
      checkAuthStatus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
    ]).start();
  };

  const checkAuthStatus = async () => {
    try {
      // Show splash for at least 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const user = await storage.getUser();
      const token = await storage.getToken();

      if (user && token) {
        // User is authenticated, go to main app
        setTimeout(() => {
          router.replace("/(tabs)");
        }, 100);
      } else {
        // Not authenticated, show landing page first
        setTimeout(() => {
          router.replace("/landing");
        }, 100);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setTimeout(() => {
        router.replace("/landing");
      }, 100);
    }
  };

  // Don't render anything until we're ready
  if (!isReady) {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>⚖️</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>⚖️</Text>
          <Text style={styles.appName}>YRJR Legal Assistant</Text>
          <Text style={styles.tagline}>Your Intelligent Legal Companion</Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📌</Text>
            <Text style={styles.featureText}>Legal Pinboard</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔐</Text>
            <Text style={styles.featureText}>Secure Notes</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>⚖️</Text>
            <Text style={styles.featureText}>AI Comparator</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🧠</Text>
            <Text style={styles.featureText}>Smart Learning</Text>
          </View>
        </View>

        <View style={styles.loadingContainer}>
          <View style={styles.loadingBar}>
            <Animated.View
              style={[
                styles.loadingProgress,
                {
                  width: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.loadingText}>
            Loading your legal workspace...
          </Text>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by AI • Secured by Design</Text>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e40af",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 60,
  },
  feature: {
    alignItems: "center",
    margin: 16,
    width: 80,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    fontWeight: "500",
  },
  loadingContainer: {
    width: "100%",
    alignItems: "center",
  },
  loadingBar: {
    width: "80%",
    height: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    marginBottom: 16,
    overflow: "hidden",
  },
  loadingProgress: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 4,
  },
  versionText: {
    fontSize: 10,
    color: "rgba(255,255,255,0.5)",
  },
});
