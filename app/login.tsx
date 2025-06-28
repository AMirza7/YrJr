import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { DEMO_ACCOUNTS } from "@/constants/auth";
import { storage } from "@/services/storage";
import { User } from "@/types";

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

    // Check demo accounts
    const demoAccount = DEMO_ACCOUNTS.find(
      (account) => account.email === email && account.password === password,
    );

    if (!demoAccount) {
      Alert.alert("Error", "Invalid credentials");
      setLoading(false);
      return;
    }

    // Create user and save
    const user: User = {
      id: `demo_${demoAccount.role}_${Date.now()}`,
      email: demoAccount.email,
      name: demoAccount.name,
      role: demoAccount.role,
      isVerified: true,
    };

    await storage.setUser(user);
    await storage.setToken(`token_${user.id}`);

    setLoading(false);
    router.replace("/dashboard");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>

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

      <View style={styles.demo}>
        <Text style={styles.demoTitle}>Demo Accounts:</Text>
        {DEMO_ACCOUNTS.map((account) => (
          <TouchableOpacity
            key={account.role}
            style={styles.demoButton}
            onPress={() => {
              setEmail(account.email);
              setPassword(account.password);
            }}
          >
            <Text style={styles.demoText}>{account.displayTitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
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
