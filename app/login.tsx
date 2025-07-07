import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import PasswordInput from "@/components/ui/PasswordInput";
import PhoneInput from "@/components/ui/PhoneInput";

export default function LoginScreen() {
  const { theme } = useTheme();
  const { t } = useLocalization();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log("🚀 Login attempt started");
    console.log("📱 Phone:", phone);
    console.log("🔑 Password length:", password?.length);

    if (!phone || !password) {
      Alert.alert(t("error"), t("enterPhone") + " and " + t("enterPassword"));
      return;
    }

    setLoading(true);

    try {
      // Map demo phone numbers to email accounts
      const demoPhoneMap: {
        [key: string]: { email: string; password: string };
      } = {
        "9876543210": { email: "lawyer@yrjr.app", password: "demo123" },
        "9123456780": { email: "jr.lawyer@yrjr.app", password: "demo123" },
        "9234567890": { email: "assistant@yrjr.app", password: "demo123" },
        "9333333333": { email: "clerk@yrjr.app", password: "demo123" },
        "9345678901": { email: "helper@yrjr.app", password: "demo123" },
        "9456789012": { email: "student@yrjr.app", password: "demo123" },
        "9567890123": { email: "user@yrjr.app", password: "demo123" },
        "9999999999": { email: "admin@yrjr.app", password: "admin123" },
      };

      const demoAccount = demoPhoneMap[phone];
      console.log("👤 Demo account found:", !!demoAccount);
      console.log("📧 Demo email:", demoAccount?.email);

      if (demoAccount) {
        console.log("🔍 Checking password match...");
        // Verify password matches
        if (password !== demoAccount.password) {
          console.log("❌ Password mismatch");
          Alert.alert(
            t("error"),
            `Invalid password for this demo account. Use '${demoAccount.password}'`,
          );
          setLoading(false);
          return;
        }

        console.log("✅ Password matches, calling authService.login...");
        const response = await authService.login(
          demoAccount.email,
          demoAccount.password,
        );

        console.log("📝 Login response:", {
          success: response.success,
          hasUser: !!response.user,
          userRole: response.user?.role,
          message: response.message,
        });

        if (response.success && response.user) {
          console.log("🎉 Login successful, navigating...");
          if (response.user.role === "admin") {
            console.log("🏛️ Navigating to admin");
            router.replace("/admin");
          } else {
            console.log("📱 Navigating to tabs");
            router.replace("/(tabs)");
          }
        } else {
          console.log("❌ Login failed:", response.message);
          Alert.alert(t("error"), response.message || "Demo login failed");
        }
      } else {
        console.log("📱 Non-demo account, using phone login...");
        // For non-demo accounts, use phone-based login
        const response = await authService.loginWithPhone(phone, password);

        console.log("📝 Phone login response:", {
          success: response.success,
          hasUser: !!response.user,
          message: response.message,
        });

        if (response.success && response.user) {
          if (response.user.role === "admin") {
            router.replace("/admin");
          } else {
            router.replace("/(tabs)");
          }
        } else {
          Alert.alert(t("error"), response.message || "Invalid credentials");
        }
      }
    } catch (error) {
      console.error("💥 Login error:", error);
      Alert.alert(t("error"), "Login failed. Please try again.");
    } finally {
      console.log("🏁 Login process finished, setting loading to false");
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
        <PhoneInput
          value={phone}
          onChangeText={setPhone}
          placeholder="XXXXX-XXXXX"
          label={t("phoneNumber")}
        />

        <PasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder={t("password")}
          containerStyle={{ marginBottom: 0 }}
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
          <TouchableOpacity onPress={() => router.push("/forgot-password")}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.linkText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.demo}>
          <Text style={styles.demoTitle}>Demo Accounts:</Text>

          <TouchableOpacity
            style={styles.demoButton}
            onPress={() => {
              setPhone("9876543210");
              setPassword("demo123");
              setTimeout(() => handleLogin(), 100);
            }}
          >
            <Text style={styles.demoText}>⚖️ Senior Lawyer</Text>
            <Text style={styles.demoEmail}>📱 9876543210 | 🔑 demo123</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.demoButton}
            onPress={() => {
              setPhone("9123456780");
              setPassword("demo123");
              setTimeout(() => handleLogin(), 100);
            }}
          >
            <Text style={styles.demoText}>👨‍💼 Junior Lawyer</Text>
            <Text style={styles.demoEmail}>📱 9123456780 | 🔑 demo123</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.demoButton}
            onPress={() => {
              setPhone("9234567890");
              setPassword("demo123");
              setTimeout(() => handleLogin(), 100);
            }}
          >
            <Text style={styles.demoText}>📋 Legal Assistant</Text>
            <Text style={styles.demoEmail}>📱 9234567890 | 🔑 demo123</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.demoButton}
            onPress={() => {
              setPhone("9333333333");
              setPassword("demo123");
              setTimeout(() => handleLogin(), 100);
            }}
          >
            <Text style={styles.demoText}>⌨️ Legal Clerk/Typist</Text>
            <Text style={styles.demoEmail}>📱 9333333333 | 🔑 demo123</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.demoButton}
            onPress={() => {
              setPhone("9345678901");
              setPassword("demo123");
              setTimeout(() => handleLogin(), 100);
            }}
          >
            <Text style={styles.demoText}>🏢 Office Helper</Text>
            <Text style={styles.demoEmail}>📱 9345678901 | 🔑 demo123</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.demoButton}
            onPress={() => {
              setPhone("9456789012");
              setPassword("demo123");
              setTimeout(() => handleLogin(), 100);
            }}
          >
            <Text style={styles.demoText}>🎓 Law Student</Text>
            <Text style={styles.demoEmail}>📱 9456789012 | 🔑 demo123</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.demoButton}
            onPress={() => {
              setPhone("9567890123");
              setPassword("demo123");
              setTimeout(() => handleLogin(), 100);
            }}
          >
            <Text style={styles.demoText}>👤 Regular User</Text>
            <Text style={styles.demoEmail}>📱 9567890123 | 🔑 demo123</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoButton, styles.adminDemoButton]}
            onPress={() => {
              setPhone("9999999999");
              setPassword("admin123");
              setTimeout(() => handleLogin(), 100);
            }}
          >
            <Text style={[styles.demoText, styles.adminDemoText]}>
              🏛️ Admin Access
            </Text>
            <Text style={styles.demoEmail}>📱 9999999999 | 🔑 admin123</Text>
          </TouchableOpacity>
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
