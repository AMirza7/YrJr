import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withDelay,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { LegalTheme } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface ScreenTransitionProps {
  children: React.ReactNode;
  loading?: boolean;
  fadeInDelay?: number;
  slideDirection?: "up" | "down" | "left" | "right" | "none";
}

export const ScreenTransition: React.FC<ScreenTransitionProps> = ({
  children,
  loading = false,
  fadeInDelay = 0,
  slideDirection = "up",
}) => {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  const opacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    if (!loading) {
      // Set initial positions based on slide direction
      switch (slideDirection) {
        case "up":
          translateY.value = 50;
          break;
        case "down":
          translateY.value = -50;
          break;
        case "left":
          translateX.value = 50;
          break;
        case "right":
          translateX.value = -50;
          break;
        default:
          break;
      }

      // Animate to final position
      opacity.value = withDelay(fadeInDelay, withTiming(1, { duration: 400 }));

      translateX.value = withDelay(
        fadeInDelay,
        withSpring(0, { damping: 15, stiffness: 150 }),
      );

      translateY.value = withDelay(
        fadeInDelay,
        withSpring(0, { damping: 15, stiffness: 150 }),
      );

      scale.value = withDelay(
        fadeInDelay,
        withSpring(1, { damping: 12, stiffness: 100 }),
      );
    } else {
      // Reset for loading state
      opacity.value = 0;
      scale.value = 0.95;
      translateX.value =
        slideDirection === "left" ? 50 : slideDirection === "right" ? -50 : 0;
      translateY.value =
        slideDirection === "up" ? 50 : slideDirection === "down" ? -50 : 0;
    }
  }, [loading, fadeInDelay, slideDirection]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  if (loading) {
    return <ScreenLoader />;
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

// Loading component with elegant animation
const ScreenLoader: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo fade in
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));

    // Continuous rotation
    const rotateAnimation = () => {
      rotation.value = withTiming(
        rotation.value + 360,
        { duration: 2000 },
        () => {
          "worklet";
          rotateAnimation();
        },
      );
    };
    rotateAnimation();

    // Pulse animation
    const pulseAnimation = () => {
      scale.value = withTiming(1.1, { duration: 1000 }, () => {
        "worklet";
        scale.value = withTiming(1, { duration: 1000 }, () => {
          "worklet";
          pulseAnimation();
        });
      });
    };
    pulseAnimation();
  }, []);

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  const dotAnimations = Array.from({ length: 3 }, (_, index) => {
    const dotOpacity = useSharedValue(0.3);

    useEffect(() => {
      const animateDot = () => {
        dotOpacity.value = withDelay(
          index * 200,
          withTiming(1, { duration: 600 }, () => {
            "worklet";
            dotOpacity.value = withTiming(0.3, { duration: 600 }, () => {
              "worklet";
              animateDot();
            });
          }),
        );
      };
      animateDot();
    }, []);

    return useAnimatedStyle(() => ({
      opacity: dotOpacity.value,
    }));
  });

  return (
    <View
      style={[styles.loaderContainer, { backgroundColor: theme.background }]}
    >
      <LinearGradient
        colors={[theme.primary + "10", theme.secondary + "10"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.loaderContent}>
        {/* Rotating Ring */}
        <Animated.View style={[styles.rotatingRing, rotationStyle]}>
          <View
            style={[
              styles.ring,
              {
                borderColor: theme.primary + "30",
                borderTopColor: theme.primary,
              },
            ]}
          />
        </Animated.View>

        {/* Logo */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <View style={[styles.logoCircle, { backgroundColor: theme.primary }]}>
            <Animated.Text
              style={[styles.logoText, { color: theme.textInverse }]}
            >
              ⚖️
            </Animated.Text>
          </View>
        </Animated.View>

        {/* Loading Dots */}
        <View style={styles.dotsContainer}>
          {dotAnimations.map((animatedStyle, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: theme.primary },
                animatedStyle,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

// Fade transition for navigation
export const FadeTransition: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, fadeStyle]}>
      {children}
    </Animated.View>
  );
};

// Slide transition for modals
interface SlideTransitionProps {
  children: React.ReactNode;
  visible: boolean;
  direction?: "up" | "down" | "left" | "right";
  onAnimationComplete?: () => void;
}

export const SlideTransition: React.FC<SlideTransitionProps> = ({
  children,
  visible,
  direction = "up",
  onAnimationComplete,
}) => {
  const translateX = useSharedValue(
    direction === "left"
      ? -screenWidth
      : direction === "right"
        ? screenWidth
        : 0,
  );
  const translateY = useSharedValue(
    direction === "up"
      ? screenHeight
      : direction === "down"
        ? -screenHeight
        : 0,
  );
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateX.value = withTiming(
        direction === "left"
          ? -screenWidth
          : direction === "right"
            ? screenWidth
            : 0,
        { duration: 250 },
      );
      translateY.value = withTiming(
        direction === "up"
          ? screenHeight
          : direction === "down"
            ? -screenHeight
            : 0,
        { duration: 250 },
        onAnimationComplete,
      );
      opacity.value = withTiming(0, { duration: 250 });
    }
  }, [visible, direction]);

  const slideStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View style={[styles.container, slideStyle]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  rotatingRing: {
    position: "absolute",
  },
  ring: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 32,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
