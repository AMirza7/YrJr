import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { styles } from "@/constants/AppStyles";
import { DEMO_ACCOUNTS } from "@/constants/auth";
import { useAuth } from "@/components/auth/AuthProvider";

export default function WelcomeScreen() {
  const { loginWithDemo } = useAuth();

  const handleDemoLogin = async (role: string) => {
    const result = await loginWithDemo(role as any);
    if (result.success) {
      router.replace("/(main)/(tabs)/home");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.centerContainer}>
        <Text style={styles.title}>⚖️ YrJr Legal Assistant</Text>
        <Text style={styles.subtitle}>Your AI-powered legal companion</Text>

        <View style={styles.card}>
          <Text style={[styles.text, { fontWeight: "600", marginBottom: 16 }]}>
            Quick Demo Access
          </Text>

          {DEMO_ACCOUNTS.map((account) => (
            <TouchableOpacity
              key={account.role}
              style={[styles.button, { backgroundColor: "#6366f1" }]}
              onPress={() => handleDemoLogin(account.role)}
            >
              <Text style={styles.buttonText}>{account.displayTitle} Demo</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#10b981" }]}
            onPress={() => router.push("/(onboarding)/login")}
          >
            <Text style={styles.buttonText}>Manual Login</Text>
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.text,
            { textAlign: "center", fontSize: 14, marginTop: 20 },
          ]}
        >
          All demo accounts use password: demo123
        </Text>
      </View>
    </View>
  );
}
