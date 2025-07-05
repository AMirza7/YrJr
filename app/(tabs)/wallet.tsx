import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { authService } from "@/services/auth";
import { User } from "@/types";

interface WalletBalance {
  current: number;
  pending: number;
  total: number;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type:
    | "referral_bonus"
    | "subscription_cashback"
    | "withdrawal"
    | "adjustment";
  description: string;
  status: "completed" | "pending" | "failed";
  referenceId?: string;
}

export default function WalletScreen() {
  const { theme } = useTheme();
  const { t } = useLocalization();
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        // Mock API calls - replace with actual API
        const mockBalance: WalletBalance = {
          current: 1850,
          pending: 150,
          total: 2000,
        };

        const mockTransactions: Transaction[] = [
          {
            id: "txn_001",
            date: "2024-01-15T10:30:00Z",
            amount: 50,
            type: "referral_bonus",
            description: "Referral bonus for inviting Adv. Priya Sharma",
            status: "completed",
            referenceId: "REF_PS_001",
          },
          {
            id: "txn_002",
            date: "2024-01-14T15:20:00Z",
            amount: 50,
            type: "referral_bonus",
            description: "Referral bonus for inviting Rajesh Kumar",
            status: "completed",
            referenceId: "REF_RK_002",
          },
          {
            id: "txn_003",
            date: "2024-01-13T09:45:00Z",
            amount: 25,
            type: "subscription_cashback",
            description: "Premium subscription cashback",
            status: "completed",
          },
          {
            id: "txn_004",
            date: "2024-01-12T14:10:00Z",
            amount: -500,
            type: "withdrawal",
            description: "Bank transfer to SBI ****1234",
            status: "completed",
            referenceId: "WTH_001",
          },
          {
            id: "txn_005",
            date: "2024-01-11T11:30:00Z",
            amount: 50,
            type: "referral_bonus",
            description: "Referral bonus for inviting Amit Singh",
            status: "pending",
            referenceId: "REF_AS_003",
          },
        ];

        setBalance(mockBalance);
        setTransactions(mockTransactions);
      }
    } catch (error) {
      console.error("Error loading wallet data:", error);
      Alert.alert("Error", "Failed to load wallet information");
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
          <Text style={styles.subscriptionIcon}>💰</Text>
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
            You need a premium subscription to access the wallet feature
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

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "referral_bonus":
        return "🎁";
      case "subscription_cashback":
        return "💳";
      case "withdrawal":
        return "🏦";
      case "adjustment":
        return "⚖️";
      default:
        return "💰";
    }
  };

  const getTransactionColor = (type: Transaction["type"], amount: number) => {
    if (amount > 0) return theme.colors.success;
    if (amount < 0) return theme.colors.error;
    return theme.colors.textSecondary;
  };

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return theme.colors.success;
      case "pending":
        return theme.colors.warning;
      case "failed":
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const formatAmount = (amount: number) => {
    const sign = amount >= 0 ? "+" : "";
    return `${sign}₹${Math.abs(amount)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleWithdraw = () => {
    Alert.alert(
      "Withdraw Funds",
      "Withdrawal feature will be available soon. You can withdraw funds to your registered bank account.",
      [{ text: "OK" }],
    );
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
            Loading wallet information...
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
            💰 My Wallet
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Track your earnings and manage payments
          </Text>
        </View>

        {/* Balance Card */}
        <View
          style={[
            styles.balanceCard,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceTitle}>Current Balance</Text>
            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={handleWithdraw}
              accessibilityLabel="Withdraw funds"
            >
              <Text style={styles.withdrawButtonText}>💸 Withdraw</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.balanceAmount}>₹{balance?.current || 0}</Text>

          <View style={styles.balanceDetails}>
            <View style={styles.balanceDetailItem}>
              <Text style={styles.balanceDetailLabel}>Pending</Text>
              <Text style={styles.balanceDetailValue}>
                ₹{balance?.pending || 0}
              </Text>
            </View>
            <View style={styles.balanceDetailItem}>
              <Text style={styles.balanceDetailLabel}>Total Earned</Text>
              <Text style={styles.balanceDetailValue}>
                ₹{balance?.total || 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View
          style={[
            styles.quickActions,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text
            style={[styles.quickActionsTitle, { color: theme.colors.text }]}
          >
            Quick Actions
          </Text>
          <View style={styles.quickActionButtons}>
            <TouchableOpacity
              style={[
                styles.quickActionButton,
                { backgroundColor: theme.colors.success },
              ]}
              onPress={() =>
                Alert.alert(
                  "Feature Coming Soon",
                  "Add money feature will be available soon",
                )
              }
              accessibilityLabel="Add money to wallet"
            >
              <Text style={styles.quickActionButtonText}>➕ Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.quickActionButton,
                { backgroundColor: theme.colors.info },
              ]}
              onPress={() =>
                Alert.alert(
                  "Feature Coming Soon",
                  "Payment history feature will be available soon",
                )
              }
              accessibilityLabel="View payment history"
            >
              <Text style={styles.quickActionButtonText}>📊 History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transactions */}
        <View style={styles.transactionsSection}>
          <Text
            style={[styles.transactionsTitle, { color: theme.colors.text }]}
          >
            Recent Transactions
          </Text>

          <View
            style={[
              styles.transactionsList,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <View
                  key={transaction.id}
                  style={[
                    styles.transactionItem,
                    { borderBottomColor: theme.colors.border },
                  ]}
                >
                  <View style={styles.transactionIcon}>
                    <Text style={styles.transactionIconText}>
                      {getTransactionIcon(transaction.type)}
                    </Text>
                  </View>

                  <View style={styles.transactionDetails}>
                    <Text
                      style={[
                        styles.transactionDescription,
                        { color: theme.colors.text },
                      ]}
                    >
                      {transaction.description}
                    </Text>
                    <View style={styles.transactionMeta}>
                      <Text
                        style={[
                          styles.transactionDate,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
                        {formatDate(transaction.date)}
                      </Text>
                      <View
                        style={[
                          styles.transactionStatus,
                          {
                            backgroundColor: getStatusColor(transaction.status),
                          },
                        ]}
                      >
                        <Text style={styles.transactionStatusText}>
                          {transaction.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    {transaction.referenceId && (
                      <Text
                        style={[
                          styles.transactionRef,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
                        Ref: {transaction.referenceId}
                      </Text>
                    )}
                  </View>

                  <View style={styles.transactionAmount}>
                    <Text
                      style={[
                        styles.transactionAmountText,
                        {
                          color: getTransactionColor(
                            transaction.type,
                            transaction.amount,
                          ),
                        },
                      ]}
                    >
                      {formatAmount(transaction.amount)}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyTransactions}>
                <Text style={styles.emptyTransactionsIcon}>📝</Text>
                <Text
                  style={[
                    styles.emptyTransactionsText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  No transactions yet
                </Text>
                <Text
                  style={[
                    styles.emptyTransactionsSubtext,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Your transactions will appear here
                </Text>
              </View>
            )}
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
  balanceCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  balanceTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.9,
  },
  withdrawButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  withdrawButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  balanceAmount: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 16,
  },
  balanceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balanceDetailItem: {
    alignItems: "center",
  },
  balanceDetailLabel: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 4,
  },
  balanceDetailValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  quickActions: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  quickActionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  quickActionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  transactionsSection: {
    marginBottom: 20,
  },
  transactionsTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  transactionsList: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionIconText: {
    fontSize: 16,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  transactionStatusText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "700",
  },
  transactionRef: {
    fontSize: 11,
    fontFamily: "monospace",
  },
  transactionAmount: {
    alignItems: "flex-end",
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: "700",
  },
  emptyTransactions: {
    padding: 40,
    alignItems: "center",
  },
  emptyTransactionsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTransactionsText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyTransactionsSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
});
