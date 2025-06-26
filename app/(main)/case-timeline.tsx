import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams } from "expo-router";

import { CaseTimeline } from "@/components/features/CaseTimeline";
import { LegalTheme } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthService } from "@/services/auth";
import { UserRole } from "@/types";

export default function CaseTimelineScreen() {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const { caseId } = useLocalSearchParams<{ caseId: string }>();
  const [userRole, setUserRole] = useState<UserRole>("law_student");

  useEffect(() => {
    loadUserRole();
  }, []);

  const loadUserRole = async () => {
    try {
      const user = await AuthService.getUser();
      if (user) {
        setUserRole(user.role);
      }
    } catch (error) {
      console.error("Error loading user role:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <CaseTimeline caseId={caseId || "demo_case_001"} userRole={userRole} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
