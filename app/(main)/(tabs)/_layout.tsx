import { Tabs } from "expo-router";
import React from "react";
import { Platform, Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1e40af",
        tabBarInactiveTintColor: "#6b7280",
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: "#ffffff",
            borderTopWidth: 1,
            borderTopColor: "#e5e7eb",
          },
          default: {
            backgroundColor: "#ffffff",
            borderTopColor: "#e5e7eb",
            elevation: 8,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabIcon name="🏠" />,
        }}
      />
      <Tabs.Screen
        name="court-orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => <TabIcon name="📋" />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => <TabIcon name="💬" />,
        }}
      />
      <Tabs.Screen
        name="directory"
        options={{
          title: "Lawyers",
          tabBarIcon: ({ color }) => <TabIcon name="👥" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabIcon name="👤" />,
        }}
      />
    </Tabs>
  );
}

// Simple tab icon component using emojis
function TabIcon({ name }: { name: string }) {
  return <Text style={{ fontSize: 24 }}>{name}</Text>;
}
