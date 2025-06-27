import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  LegalTheme,
  FontSizes,
  Spacing,
  BorderRadius,
  Shadows,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

interface FABAction {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  actions?: FABAction[];
  position?: "bottomRight" | "bottomLeft" | "bottomCenter";
  size?: "small" | "large";
}

export function FloatingActionButton({
  actions,
  position = "bottomRight",
  size = "large",
}: FloatingActionButtonProps) {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const [isOpen, setIsOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;

  const defaultActions: FABAction[] = [
    {
      id: "scan",
      label: "Scan Document",
      icon: "scan",
      onPress: () => {
        router.push("/(main)/document-scanner");
        toggleFAB();
      },
      color: theme.success,
    },
    {
      id: "ai",
      label: "Ask AI",
      icon: "chatbubble-ellipses",
      onPress: () => {
        router.push("/(main)/ai-assistant");
        toggleFAB();
      },
      color: theme.primary,
    },
    {
      id: "help",
      label: "Help & Support",
      icon: "help-circle",
      onPress: () => {
        router.push("/(main)/help-support");
        toggleFAB();
      },
      color: theme.info,
    },
    {
      id: "message",
      label: "New Message",
      icon: "mail",
      onPress: () => {
        router.push("/(main)/(tabs)/messages");
        toggleFAB();
      },
      color: theme.secondary,
    },
  ];

  const fabActions = actions || defaultActions;

  const toggleFAB = () => {
    const toValue = isOpen ? 0 : 1;

    Animated.parallel([
      Animated.spring(animation, {
        toValue,
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }),
      Animated.timing(opacityAnimation, {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setIsOpen(!isOpen);
  };

  const getPositionStyle = () => {
    const baseStyle = {
      position: "absolute" as const,
      bottom: Spacing.xl + 20,
    };

    switch (position) {
      case "bottomLeft":
        return { ...baseStyle, left: Spacing.md };
      case "bottomCenter":
        return { ...baseStyle, alignSelf: "center" as const };
      case "bottomRight":
      default:
        return { ...baseStyle, right: Spacing.md };
    }
  };

  const mainButtonSize = size === "large" ? 60 : 48;
  const actionButtonSize = size === "large" ? 48 : 40;

  return (
    <View style={[styles.container, getPositionStyle()]}>
      {/* Action Buttons */}
      {fabActions.map((action, index) => {
        const translateY = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -(60 + index * 60)],
        });

        return (
          <Animated.View
            key={action.id}
            style={[
              styles.actionContainer,
              {
                transform: [{ translateY }],
                opacity: opacityAnimation,
              },
            ]}
          >
            <Text
              style={[
                styles.actionLabel,
                {
                  color: theme.text,
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              {action.label}
            </Text>
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: action.color || theme.primary,
                  width: actionButtonSize,
                  height: actionButtonSize,
                  borderRadius: actionButtonSize / 2,
                },
                Shadows.md,
              ]}
              onPress={action.onPress}
              activeOpacity={0.8}
            >
              <Ionicons
                name={action.icon}
                size={size === "large" ? 24 : 20}
                color="white"
              />
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      {/* Main FAB Button */}
      <TouchableOpacity
        style={[
          styles.mainButton,
          {
            backgroundColor: theme.primary,
            width: mainButtonSize,
            height: mainButtonSize,
            borderRadius: mainButtonSize / 2,
          },
          Shadows.lg,
        ]}
        onPress={toggleFAB}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.mainButtonIcon,
            {
              transform: [
                {
                  rotate: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "45deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <Ionicons
            name="add"
            size={size === "large" ? 32 : 24}
            color="white"
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Backdrop */}
      {isOpen && (
        <TouchableOpacity
          style={[
            styles.backdrop,
            {
              backgroundColor: theme.overlay,
            },
          ]}
          onPress={toggleFAB}
          activeOpacity={1}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    zIndex: 1000,
  },
  actionContainer: {
    alignItems: "center",
    marginBottom: Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
  },
  actionLabel: {
    fontSize: FontSizes.sm,
    fontWeight: "500",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.sm,
    borderWidth: 1,
    minWidth: 100,
    textAlign: "center",
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  mainButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  mainButtonIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    position: "absolute",
    top: -Dimensions.get("window").height,
    left: -Dimensions.get("window").width / 2,
    width: Dimensions.get("window").width * 2,
    height: Dimensions.get("window").height * 2,
    zIndex: -1,
  },
});
