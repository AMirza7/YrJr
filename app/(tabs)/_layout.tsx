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
        const tabs = getVisibleTabs(currentUser.role);
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
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            android: {
              elevation: 8,
            },
            default: {
              boxShadow: "0px -2px 4px rgba(0, 0, 0, 0.1)",
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
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
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 20,
                    opacity: focused ? 1 : 0.6,
                    marginBottom: 2,
                  }}
                >
                  {tab.icon}
                </Text>
                {focused && (
                  <View
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: tab.color,
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
    </Tabs>
  );
}
