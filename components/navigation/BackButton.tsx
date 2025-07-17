import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { router } from "expo-router";

interface BackButtonProps {
  onPress?: () => void;
  title?: string;
  style?: ViewStyle;
  color?: string;
  size?: number;
}

export default function BackButton({
  onPress,
  title = "Back",
  style,
  color = "#1e40af",
  size = 16,
}: BackButtonProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      try {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/(tabs)/home");
        }
      } catch (error) {
        router.replace("/(tabs)/home");
      }
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text style={[styles.arrow, { color, fontSize: size + 4 }]}>←</Text>
      <Text style={[styles.title, { color, fontSize: size }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  arrow: {
    fontWeight: "bold",
    marginRight: 8,
  },
  title: {
    fontWeight: "500",
  },
});
