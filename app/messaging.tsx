import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { User } from "@/types";
import BackButton from "@/components/navigation/BackButton";
import MessagingSystem from "@/components/messaging/MessagingSystem";

export default function MessagingScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
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

  const handleClose = () => {
    try {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push("/(tabs)/home");
      }
    } catch (error) {
      router.push("/(tabs)/home");
    }
  };

  if (loading || !user) {
    return <View style={styles.container} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={handleClose} />
      </View>
      <MessagingSystem currentUserId={user.id} onClose={handleClose} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
});
