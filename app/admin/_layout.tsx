import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { User } from "@/types";
import { View, Text, StyleSheet } from "react-native";

export default function AdminLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser || currentUser.role !== "admin") {
        router.replace("/login");
        return;
      }
      setUser(currentUser);
    } catch (error) {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Verifying admin access...</Text>
      </View>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="users" />
      <Stack.Screen name="pending-approvals" />
      <Stack.Screen name="templates-approval" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
