import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./Card";
import { useAuth } from "@/components/auth/AuthContext";
import { tokenManager } from "@/services/tokenManager";
import { LegalTheme } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Config } from "@/config/env";

interface AppStatusProps {
  visible: boolean;
  onClose: () => void;
}

export const AppStatus: React.FC<AppStatusProps> = ({ visible, onClose }) => {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const { user, isAuthenticated, isLoading } = useAuth();
  const [authStatus, setAuthStatus] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (visible) {
      loadAuthStatus();
    }
  }, [visible]);

  const loadAuthStatus = async () => {
    try {
      setRefreshing(true);
      const status = await tokenManager.getAuthStatus();
      setAuthStatus(status);
    } catch (error) {
      console.error("Error loading auth status:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const refreshStatus = () => {
    loadAuthStatus();
  };

  if (!visible) return null;

  const statusItems = [
    {
      label: "Authentication",
      value: isAuthenticated ? "✅ Authenticated" : "❌ Not authenticated",
      status: isAuthenticated ? "success" : "error",
    },
    {
      label: "Loading State",
      value: isLoading ? "🔄 Loading..." : "✅ Ready",
      status: isLoading ? "warning" : "success",
    },
    {
      label: "User",
      value: user ? `${user.name} (${user.role})` : "No user",
      status: user ? "success" : "neutral",
    },
    {
      label: "Environment",
      value: Config.IS_DEV ? "Development" : "Production",
      status: "neutral",
    },
    {
      label: "API Base URL",
      value: Config.API_BASE_URL || "Not configured",
      status: Config.API_BASE_URL ? "success" : "warning",
    },
  ];

  if (authStatus) {
    statusItems.push(
      {
        label: "Access Token",
        value: authStatus.hasAccessToken ? "✅ Present" : "❌ Missing",
        status: authStatus.hasAccessToken ? "success" : "error",
      },
      {
        label: "Refresh Token",
        value: authStatus.hasRefreshToken ? "✅ Present" : "❌ Missing",
        status: authStatus.hasRefreshToken ? "success" : "error",
      },
      {
        label: "Token Expired",
        value: authStatus.isTokenExpired ? "❌ Expired" : "✅ Valid",
        status: authStatus.isTokenExpired ? "error" : "success",
      },
      {
        label: "Time Until Expiry",
        value: `${Math.floor(authStatus.timeUntilExpiry / 60)}m ${authStatus.timeUntilExpiry % 60}s`,
        status: authStatus.timeUntilExpiry > 300 ? "success" : "warning",
      },
      {
        label: "Biometric",
        value: authStatus.biometricEnabled ? "✅ Enabled" : "❌ Disabled",
        status: "neutral",
      },
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return theme.success;
      case "error":
        return theme.error;
      case "warning":
        return theme.warning;
      default:
        return theme.textSecondary;
    }
  };

  return (
    <View style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
      <Card style={[styles.modal, { backgroundColor: theme.surface }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            🔧 App Status
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {statusItems.map((item, index) => (
            <View key={index} style={styles.statusItem}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                {item.label}
              </Text>
              <Text
                style={[styles.value, { color: getStatusColor(item.status) }]}
              >
                {item.value}
              </Text>
            </View>
          ))}

          {authStatus && Config.IS_DEV && (
            <View style={styles.debugSection}>
              <Text style={[styles.debugTitle, { color: theme.text }]}>
                Debug Info
              </Text>
              <Text
                style={[styles.debugText, { color: theme.textSecondary }]}
                selectable
              >
                {JSON.stringify(authStatus, null, 2)}
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={refreshStatus}
            style={[
              styles.refreshButton,
              { backgroundColor: theme.primary + "20" },
            ]}
            disabled={refreshing}
          >
            <Ionicons
              name="refresh"
              size={16}
              color={theme.primary}
              style={refreshing ? { opacity: 0.5 } : {}}
            />
            <Text
              style={[
                styles.refreshText,
                { color: theme.primary },
                refreshing ? { opacity: 0.5 } : {},
              ]}
            >
              {refreshing ? "Refreshing..." : "Refresh Status"}
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    width: "90%",
    maxWidth: 500,
    maxHeight: "80%",
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  statusItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  value: {
    fontSize: 14,
    flex: 2,
    textAlign: "right",
  },
  debugSection: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 8,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    fontFamily: "monospace",
  },
  actions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  refreshText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
