import { useEffect, useState } from "react";
import { Tabs, router } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { storage } from "@/services/storage";
import { User } from "@/types";
import { getVisibleTabs, getRoleColor } from "@/constants/tabs";

export default function TabLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await storage.getUser();
      if (!userData) {
        router.replace("/login");
        return;
      }
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  const visibleTabs = getVisibleTabs(user.role);
  const primaryColor = getRoleColor(user.role);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
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
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>
                {tab.icon}
              </Text>
            ),
          }}
        />
      ))}

      {/* Hide any tabs not visible for this role */}
      {["home", "pinboard", "timeline", "notes", "search", "profile"]
        .filter((tabName) => !visibleTabs.find((tab) => tab.name === tabName))
        .map((hiddenTab) => (
          <Tabs.Screen
            key={hiddenTab}
            name={hiddenTab}
            options={{
              href: null, // This hides the tab completely
            }}
          />
        ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
});
