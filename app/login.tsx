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

export default function LoginScreen() {
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
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1e40af",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  demo: {
    marginTop: 20,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  demoButton: {
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  demoText: {
    fontSize: 14,
    color: "#374151",
  },
});
