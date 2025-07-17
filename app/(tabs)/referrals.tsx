import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Share,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { authService } from "@/services/auth";
import { User } from "@/types";

interface ReferralStats {
  totalReferrals: number;
  pendingRewards: number;
  totalEarnings: number;
  referralCode: string;
}

export default function ReferralDashboard() {
  const { theme } = useTheme();
  const { t } = useLocalization();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserAndStats();
  }, []);

  const loadUserAndStats = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        // Mock API call - replace with actual API
        const mockStats: ReferralStats = {
          totalReferrals: 12,
          pendingRewards: 3,
          totalEarnings: 1850,
          referralCode: `REF${currentUser.id.slice(-6).toUpperCase()}`,
        };
        setStats(mockStats);
      }
    } catch (error) {
      console.error("Error loading referral stats:", error);
      Alert.alert("Error", "Failed to load referral information");
    } finally {
      setLoading(false);
    }
  };

  // Subscription guard
  if (user && user.subscriptionTier === "free") {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.subscriptionGuard}>
          <Text style={styles.subscriptionIcon}>🔒</Text>
          <Text
            style={[styles.subscriptionTitle, { color: theme.colors.text }]}
          >
            Premium Feature
          </Text>
          <Text
            style={[
              styles.subscriptionMessage,
              { color: theme.colors.textSecondary },
            ]}
          >
            You need a premium subscription to access the referral program
          </Text>
          <TouchableOpacity
            style={[
              styles.upgradeButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => {
              // Navigate to subscription screen
              // router.push('/subscription');
            }}
            accessibilityLabel="Upgrade to premium subscription"
          >
            <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleCopyCode = async () => {
    if (stats?.referralCode) {
      await Clipboard.setStringAsync(stats.referralCode);
      Alert.alert("Copied!", "Referral code copied to clipboard");
    }
  };

  const handleCopyLink = async () => {
    if (stats?.referralCode) {
      const link = `https://yourapp.com/signup?ref=${stats.referralCode}`;
      await Clipboard.setStringAsync(link);
      Alert.alert("Copied!", "Referral link copied to clipboard");
    }
  };

  const handleShareWhatsApp = () => {
    if (stats?.referralCode) {
      const message = `Join me on YRJR Legal Assistant! Use my referral code ${stats.referralCode} and get exclusive benefits. Download: https://yourapp.com/signup?ref=${stats.referralCode}`;
      const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
      Linking.openURL(url).catch(() => {
        Alert.alert("Error", "WhatsApp is not installed on this device");
      });
    }
  };

  const handleShareEmail = () => {
    if (stats?.referralCode) {
      const subject = "Join YRJR Legal Assistant";
      const body = `I've been using YRJR Legal Assistant and thought you might find it useful! Use my referral code ${stats.referralCode} to get started with exclusive benefits.\n\nDownload the app: https://yourapp.com/signup?ref=${stats.referralCode}`;
      const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      Linking.openURL(url);
    }
  };

  const handleShare = async () => {
    if (stats?.referralCode) {
      try {
        await Share.share({
          message: `Join me on YRJR Legal Assistant! Use my referral code ${stats.referralCode} and get exclusive benefits. Download: https://yourapp.com/signup?ref=${stats.referralCode}`,
          url: `https://yourapp.com/signup?ref=${stats.referralCode}`,
          title: "Join YRJR Legal Assistant",
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.centered}>
          <Text
            style={[styles.loadingText, { color: theme.colors.textSecondary }]}
          >
            Loading referral information...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            🎁 Referral Program
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Earn rewards by inviting friends to YRJR Legal Assistant
          </Text>
        </View>

        {/* Referral Code Banner */}
        <View
          style={[
            styles.referralBanner,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text
            style={[styles.referralBannerTitle, { color: theme.colors.text }]}
          >
            Your Referral Code
          </Text>
          <View style={styles.referralCodeContainer}>
            <Text
              style={[styles.referralCode, { color: theme.colors.primary }]}
            >
              {stats?.referralCode}
            </Text>
            <TouchableOpacity
              style={[
                styles.copyButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={handleCopyCode}
              accessibilityLabel="Copy referral code"
            >
              <Text style={styles.copyButtonText}>📋 Copy</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Share Buttons */}
        <View
          style={[
            styles.shareSection,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text
            style={[styles.shareSectionTitle, { color: theme.colors.text }]}
          >
            Share with Friends
          </Text>
          <View style={styles.shareButtons}>
            <TouchableOpacity
              style={[styles.shareButton, { backgroundColor: "#25D366" }]}
              onPress={handleShareWhatsApp}
              accessibilityLabel="Share on WhatsApp"
            >
              <Text style={styles.shareButtonText}>📱 WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.shareButton, { backgroundColor: "#1976D2" }]}
              onPress={handleShareEmail}
              accessibilityLabel="Share via email"
            >
              <Text style={styles.shareButtonText}>�� Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.shareButton,
                { backgroundColor: theme.colors.secondary },
              ]}
              onPress={handleCopyLink}
              accessibilityLabel="Copy referral link"
            >
              <Text style={styles.shareButtonText}>🔗 Copy Link</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.shareMoreButton,
              { backgroundColor: theme.colors.info },
            ]}
            onPress={handleShare}
            accessibilityLabel="Share via other apps"
          >
            <Text style={styles.shareButtonText}>📤 Share More</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <Text
            style={[styles.statsSectionTitle, { color: theme.colors.text }]}
          >
            Your Referral Stats
          </Text>

          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statCard,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Text style={styles.statIcon}>👥</Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {stats?.totalReferrals || 0}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Total Referrals
              </Text>
            </View>

            <View
              style={[
                styles.statCard,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Text style={styles.statIcon}>⏳</Text>
              <Text style={[styles.statValue, { color: theme.colors.warning }]}>
                {stats?.pendingRewards || 0}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Pending Rewards
              </Text>
            </View>

            <View
              style={[
                styles.statCard,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Text style={styles.statIcon}>💰</Text>
              <Text style={[styles.statValue, { color: theme.colors.success }]}>
                ₹{stats?.totalEarnings || 0}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Total Earnings
              </Text>
            </View>
          </View>
        </View>

        {/* How it Works */}
        <View
          style={[
            styles.howItWorksSection,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text style={[styles.howItWorksTitle, { color: theme.colors.text }]}>
            How It Works
          </Text>
          <View style={styles.howItWorksSteps}>
            <View style={styles.howItWorksStep}>
              <Text style={styles.stepNumber}>1</Text>
              <Text
                style={[styles.stepText, { color: theme.colors.textSecondary }]}
              >
                Share your referral code with friends
              </Text>
            </View>
            <View style={styles.howItWorksStep}>
              <Text style={styles.stepNumber}>2</Text>
              <Text
                style={[styles.stepText, { color: theme.colors.textSecondary }]}
              >
                They sign up and subscribe using your code
              </Text>
            </View>
            <View style={styles.howItWorksStep}>
              <Text style={styles.stepNumber}>3</Text>
              <Text
                style={[styles.stepText, { color: theme.colors.textSecondary }]}
              >
                You both earn ₹50 rewards!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
  },
  subscriptionGuard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  subscriptionIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  subscriptionTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  subscriptionMessage: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  upgradeButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  upgradeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  referralBanner: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  referralBannerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  referralCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  referralCode: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "monospace",
    letterSpacing: 2,
  },
  copyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  copyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  shareSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shareSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  shareButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  shareButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  shareMoreButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  statsSection: {
    marginBottom: 16,
  },
  statsSectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
  howItWorksSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  howItWorksTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  howItWorksSteps: {
    gap: 16,
  },
  howItWorksStep: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3b82f6",
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 32,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
