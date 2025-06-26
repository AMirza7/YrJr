import React from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

import { SecureNotesVault } from "@/components/features/SecureNotesVault";
import { LegalTheme } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function SecureVaultScreen() {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <SecureNotesVault />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
