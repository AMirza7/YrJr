import { Tabs } from "expo-router";
import { Text, View, Platform } from "react-native";
import { useEffect, useState } from "react";
import { authService } from "@/services/auth";
import { User } from "@/types";
import { getVisibleTabs } from "@/constants/tabs";

export default function TabLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [visibleTabs, setVisibleTabs] = useState<any[]>([]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const tabs = getVisibleTabs(
          currentUser.role,
          currentUser.subscriptionTier,
        );
        setVisibleTabs(tabs);
      }
    } catch (error) {
      console.error("Error loading user for tabs:", error);
    }
  };

  // If no user, redirect to login
  if (!user) {
    return null; // Will trigger redirect in individual tab screens
  }

  // If no visible tabs, show minimal layout
  if (visibleTabs.length === 0) {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#1e40af",
          tabBarInactiveTintColor: "#9CA3AF",
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>
                🏠
              </Text>
            ),
          }}
        />
      </Tabs>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1e40af",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
          paddingTop: 10,
          height: Platform.OS === "ios" ? 90 : 70,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.15,
              shadowRadius: 6,
            },
            android: {
              elevation: 12,
            },
            default: {
              boxShadow: "0px -4px 8px rgba(0, 0, 0, 0.15)",
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      {visibleTabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, color }) => (
              <View style={{ alignItems: "center", minHeight: 32 }}>
                <Text
                  style={{
                    fontSize: Platform.OS === "ios" ? 26 : 24,
                    opacity: focused ? 1 : 0.7,
                    marginBottom: 3,
                    textShadowColor: focused
                      ? "rgba(0,0,0,0.1)"
                      : "transparent",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 2,
                  }}
                >
                  {tab.icon}
                </Text>
                {focused && (
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: tab.color,
                      shadowColor: tab.color,
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.5,
                      shadowRadius: 2,
                      elevation: 2,
                    }}
                  />
                )}
              </View>
            ),
            tabBarActiveTintColor: tab.color,
          }}
        />
      ))}

      {/* Hidden tabs that don't appear in navigation but exist for routing */}
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="scanner-analytics"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="scanner-history"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}
