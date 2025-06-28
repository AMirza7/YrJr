import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import { router } from "expo-router";

interface FloatingActionButtonProps {
  userRole: string;
}

export default function FloatingActionButton({
  userRole,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const quickActions = [
    {
      icon: "📌",
      label: "New Pinboard",
      action: () => router.push("/(tabs)/pinboard"),
      roles: ["lawyer", "junior_lawyer", "lawyer_assistant"],
    },
    {
      icon: "🔐",
      label: "Secure Note",
      action: () => router.push("/(tabs)/notes"),
      roles: [
        "lawyer",
        "junior_lawyer",
        "lawyer_assistant",
        "law_office_helper",
      ],
    },
    {
      icon: "📄",
      label: "Template",
      action: () => router.push("/templates"),
      roles: [
        "lawyer",
        "junior_lawyer",
        "lawyer_assistant",
        "law_office_helper",
        "law_student",
      ],
    },
    {
      icon: "⚖️",
      label: "AI Compare",
      action: () => router.push("/ai-comparator"),
      roles: ["lawyer", "junior_lawyer", "law_student"],
    },
    {
      icon: "🧠",
      label: "Flashcards",
      action: () => router.push("/flashcards"),
      roles: [
        "lawyer",
        "junior_lawyer",
        "lawyer_assistant",
        "law_office_helper",
        "law_student",
      ],
    },
  ];

  const availableActions = quickActions.filter((action) =>
    action.roles.includes(userRole),
  );

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();

    setIsOpen(!isOpen);
  };

  const handleActionPress = (action: () => void) => {
    action();
    toggleMenu();
  };

  return (
    <View style={styles.container}>
      {/* Action Buttons */}
      {availableActions.map((action, index) => {
        const translateY = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -(60 * (index + 1))],
        });

        const opacity = animation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.5, 1],
        });

        const scale = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        });

        return (
          <Animated.View
            key={action.label}
            style={[
              styles.actionButton,
              {
                transform: [{ translateY }, { scale }],
                opacity,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.actionButtonTouchable}
              onPress={() => handleActionPress(action.action)}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
            </TouchableOpacity>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </Animated.View>
        );
      })}

      {/* Main FAB */}
      <TouchableOpacity style={styles.fab} onPress={toggleMenu}>
        <Animated.View
          style={{
            transform: [
              {
                rotate: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "45deg"],
                }),
              },
            ],
          }}
        >
          <Text style={styles.fabIcon}>+</Text>
        </Animated.View>
      </TouchableOpacity>

      {/* Backdrop */}
      {isOpen && (
        <TouchableOpacity
          style={styles.backdrop}
          onPress={toggleMenu}
          activeOpacity={1}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 90,
    right: 20,
    zIndex: 1000,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#7c3aed",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "300",
  },
  actionButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtonTouchable: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionLabel: {
    marginRight: 12,
    backgroundColor: "#111827",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "500",
  },
  backdrop: {
    position: "absolute",
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    backgroundColor: "transparent",
  },
});
