import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as Speech from "expo-speech";

import { SearchBar } from "@/components/ui/SearchBar";
import { Card } from "@/components/ui/Card";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import {
  LegalTheme,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { HOME_SECTIONS } from "@/constants/LegalConstants";
import { NotificationService } from "@/services/notifications";
import { BiometricService } from "@/services/biometric";
import { AuthService } from "@/services/auth";
import { User } from "@/types";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showBiometricAuth, setShowBiometricAuth] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AuthService.getUser();
      setUser(userData);

      // Load notification count
      const count = await NotificationService.getUnreadCount();
      setUnreadNotifications(count);

      // Check if biometric authentication is enabled and required
      const biometricEnabled = await BiometricService.isBiometricEnabled();
      if (biometricEnabled) {
        setShowBiometricAuth(true);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      Alert.alert("Search", `Searching for: ${query}`);
      // Implement search functionality here
    }
  };

  const handleSectionPress = (section: (typeof HOME_SECTIONS)[0]) => {
    if (section.route.startsWith("/")) {
      router.push(section.route as any);
    } else {
      Alert.alert(
        "Coming Soon",
        `${section.title} feature will be available soon!`,
      );
    }
  };

  const handleVoicePress = () => {
    router.push("/(main)/ai-assistant");
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "lawyer":
        return theme.lawyer;
      case "junior_lawyer":
        return theme.juniorLawyer;
      case "lawyer_assistant":
        return theme.lawyerAssistant;
      case "law_office_helper":
        return theme.lawOfficeHelper;
      case "law_student":
        return theme.lawStudent;
      default:
        return theme.primary;
    }
  };

  const formatRoleName = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>
              Good {getTimeOfDay()}
            </Text>
            <Text style={[styles.userName, { color: theme.text }]}>
              {user?.name || "User"}
            </Text>
            {user?.role && (
              <View
                style={[
                  styles.roleBadge,
                  { backgroundColor: getRoleColor(user.role) + "20" },
                ]}
              >
                <Text
                  style={[styles.roleText, { color: getRoleColor(user.role) }]}
                >
                  {formatRoleName(user.role)}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push("/(main)/notification-center")}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.text}
            />
            {unreadNotifications > 0 && (
              <View
                style={[
                  styles.notificationBadge,
                  { backgroundColor: theme.error },
                ]}
              >
                <Text
                  style={[
                    styles.notificationBadgeText,
                    { color: theme.textInverse },
                  ]}
                >
                  {unreadNotifications > 99 ? "99+" : unreadNotifications}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={handleSearch}
          onVoicePress={handleVoicePress}
          style={styles.searchBar}
        />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Quick Actions
          </Text>
          <View style={styles.sectionsGrid}>
            {HOME_SECTIONS.map((section) => (
              <TouchableOpacity
                key={section.id}
                onPress={() => handleSectionPress(section)}
                style={styles.sectionItem}
              >
                <Card style={styles.sectionCard} padding="medium">
                  <View
                    style={[
                      styles.sectionIcon,
                      { backgroundColor: section.color + "20" },
                    ]}
                  >
                    <Ionicons
                      name={section.icon as any}
                      size={24}
                      color={section.color}
                    />
                  </View>
                  <Text
                    style={[styles.sectionCardTitle, { color: theme.text }]}
                  >
                    {section.title}
                  </Text>
                  <Text
                    style={[
                      styles.sectionCardDesc,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {section.description}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}

            {/* AI Assistant */}
            <TouchableOpacity
              onPress={() => router.push("/(main)/ai-assistant")}
              style={styles.sectionItem}
            >
              <Card style={styles.sectionCard} padding="medium">
                <View
                  style={[
                    styles.sectionIcon,
                    { backgroundColor: theme.accent + "20" },
                  ]}
                >
                  <Ionicons
                    name="chatbubble-ellipses"
                    size={24}
                    color={theme.accent}
                  />
                </View>
                <Text style={[styles.sectionCardTitle, { color: theme.text }]}>
                  AI Assistant
                </Text>
                <Text
                  style={[
                    styles.sectionCardDesc,
                    { color: theme.textSecondary },
                  ]}
                >
                  Get instant legal guidance
                </Text>
              </Card>
            </TouchableOpacity>

            {/* Legal Templates */}
            <TouchableOpacity
              onPress={() => router.push("/(main)/legal-templates")}
              style={styles.sectionItem}
            >
              <Card style={styles.sectionCard} padding="medium">
                <View
                  style={[
                    styles.sectionIcon,
                    { backgroundColor: theme.secondary + "20" },
                  ]}
                >
                  <Ionicons
                    name="document-text"
                    size={24}
                    color={theme.secondary}
                  />
                </View>
                <Text style={[styles.sectionCardTitle, { color: theme.text }]}>
                  Legal Templates
                </Text>
                <Text
                  style={[
                    styles.sectionCardDesc,
                    { color: theme.textSecondary },
                  ]}
                >
                  Ready-to-use legal forms
                </Text>
              </Card>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Updates */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Recent Updates
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <Card style={styles.updateCard} padding="medium">
            <View style={styles.updateItem}>
              <View
                style={[
                  styles.updateIcon,
                  { backgroundColor: theme.info + "20" },
                ]}
              >
                <Ionicons name="document-text" size={20} color={theme.info} />
              </View>
              <View style={styles.updateContent}>
                <Text style={[styles.updateTitle, { color: theme.text }]}>
                  New BNS Section 363 Amendment
                </Text>
                <Text
                  style={[styles.updateDesc, { color: theme.textSecondary }]}
                >
                  Latest updates on criminal law procedures
                </Text>
                <Text
                  style={[styles.updateTime, { color: theme.textTertiary }]}
                >
                  2 hours ago
                </Text>
              </View>
            </View>
          </Card>

          <Card style={styles.updateCard} padding="medium">
            <View style={styles.updateItem}>
              <View
                style={[
                  styles.updateIcon,
                  { backgroundColor: theme.success + "20" },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.success}
                />
              </View>
              <View style={styles.updateContent}>
                <Text style={[styles.updateTitle, { color: theme.text }]}>
                  Supreme Court Landmark Judgment
                </Text>
                <Text
                  style={[styles.updateDesc, { color: theme.textSecondary }]}
                >
                  Important ruling on fundamental rights
                </Text>
                <Text
                  style={[styles.updateTime, { color: theme.textTertiary }]}
                >
                  5 hours ago
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
  },
  userName: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.xs,
  },
  roleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  roleText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },
  notificationButton: {
    padding: Spacing.sm,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: FontWeights.bold,
  },
  searchBar: {
    marginTop: Spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  seeAllText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  sectionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  sectionItem: {
    width: "48%",
    marginBottom: Spacing.md,
  },
  sectionCard: {
    alignItems: "center",
    minHeight: 120,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  sectionCardTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  sectionCardDesc: {
    fontSize: FontSizes.xs,
    textAlign: "center",
    lineHeight: 16,
  },
  updateCard: {
    marginBottom: Spacing.sm,
  },
  updateItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  updateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  updateContent: {
    flex: 1,
  },
  updateTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  updateDesc: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
  updateTime: {
    fontSize: FontSizes.xs,
  },
});
