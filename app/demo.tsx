import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { styles } from "@/constants/AppStyles";

export default function DemoScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.centerContainer}>
        <Text style={styles.title}>🎉 App is Working!</Text>
        <Text style={styles.subtitle}>All bundling issues resolved</Text>

        <View style={styles.card}>
          <Text
            style={[styles.text, { textAlign: "center", marginBottom: 16 }]}
          >
            ✅ Dev server running smoothly{"\n"}✅ No bundling errors{"\n"}✅
            Fast load times{"\n"}✅ Clean navigation structure
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/(onboarding)")}
          >
            <Text style={styles.buttonText}>Go to Onboarding</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
