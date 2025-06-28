import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";

export default function LoginScreen() {
  const { theme } = useTheme();
  const { t } = useLocalization();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login(email, password);

      if (response.success && response.user) {
        // Navigate based on role
        if (response.user.role === "admin") {
          router.replace("/admin");
        } else {
          router.replace("/(tabs)");
        }
      } else {
        Alert.alert("Error", response.message || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = authService.getDemoCredentials();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, { opacity: loading ? 0.7 : 1 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Signing In..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        <View style={styles.authActions}>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Feature Coming",
                "Password reset will be available soon",
              )
            }
          >
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.linkText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.demo}>
          <Text style={styles.demoTitle}>Demo Accounts:</Text>
          {demoCredentials.map((account, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.demoButton,
                account.role === "admin" && styles.adminDemoButton,
              ]}
              onPress={() => {
                setEmail(account.email);
                setPassword(account.password);
              }}
            >
              <Text
                style={[
                  styles.demoText,
                  account.role === "admin" && styles.adminDemoText,
                ]}
              >
                {account.description}
              </Text>
              <Text style={styles.demoEmail}>{account.email}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#1e40af",
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  form: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f9fafb",
  },
  button: {
    backgroundColor: "#1e40af",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  authActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  linkText: {
    color: "#1e40af",
    fontSize: 14,
    fontWeight: "500",
  },
  demo: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 20,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
    color: "#374151",
  },
  demoButton: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#9ca3af",
  },
  adminDemoButton: {
    backgroundColor: "#fef2f2",
    borderLeftColor: "#dc2626",
  },
  demoText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  adminDemoText: {
    color: "#dc2626",
  },
  demoEmail: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
});
