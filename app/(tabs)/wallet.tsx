import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { authService } from "@/services/auth";
import { User } from "@/types";
import PremiumModal from "@/components/ui/PremiumModal";

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
    | "deposit"
    | "adjustment";
  description: string;
  status: "completed" | "pending" | "failed";
  referenceId?: string;
  fromUser?: string;
  toAccount?: string;
}

interface WithdrawModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (phone: string, amount: number, upiId?: string) => void;
  balance: number;
}

interface AddMoneyModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (amount: number, method: string) => void;
}

function WithdrawModal({
  visible,
  onClose,
  onConfirm,
  balance,
}: WithdrawModalProps) {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [upiId, setUpiId] = useState("");
  const [method, setMethod] = useState<"upi" | "bank">("upi");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);

    if (!amount || withdrawAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (withdrawAmount > balance) {
      Alert.alert("Error", "Insufficient balance");
      return;
    }

    if (withdrawAmount < 100) {
      Alert.alert("Error", "Minimum withdrawal amount is ₹100");
      return;
    }

    if (!phone.trim()) {
      Alert.alert("Error", "Please enter your registered phone number");
      return;
    }

    if (method === "upi" && !upiId.trim()) {
      Alert.alert("Error", "Please enter your UPI ID");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onConfirm(phone, withdrawAmount, upiId);
      setAmount("");
      setPhone("");
      setUpiId("");
    }, 2000);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>💸 Withdraw Money</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceInfoText}>
                Available Balance: ₹{balance}
              </Text>
            </View>

            {/* Withdrawal Method */}
            <View style={styles.methodSelector}>
              <Text style={styles.sectionTitle}>Withdrawal Method</Text>
              <View style={styles.methodOptions}>
                <TouchableOpacity
                  style={[
                    styles.methodOption,
                    method === "upi" && styles.methodOptionSelected,
                  ]}
                  onPress={() => setMethod("upi")}
                >
                  <Text style={styles.methodIcon}>📱</Text>
                  <Text style={styles.methodText}>UPI Transfer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.methodOption,
                    method === "bank" && styles.methodOptionSelected,
                  ]}
                  onPress={() => setMethod("bank")}
                >
                  <Text style={styles.methodIcon}>🏦</Text>
                  <Text style={styles.methodText}>Bank Transfer</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Withdrawal Amount *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount (min ₹100)"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>

            {/* Phone Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Registered Phone Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your registered phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            {/* UPI ID for UPI method */}
            {method === "upi" && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>UPI ID *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="yourname@upi"
                  value={upiId}
                  onChangeText={setUpiId}
                  autoCapitalize="none"
                />
              </View>
            )}

            {/* Processing Info */}
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                {method === "upi"
                  ? "• UPI transfers are processed instantly\n• No additional charges\n• Transfer will be sent to your UPI ID"
                  : "• Bank transfers take 1-3 business days\n• No additional charges\n• Transfer will be sent to your registered bank account"}
              </Text>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, loading && styles.buttonDisabled]}
              onPress={handleWithdraw}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>
                  Withdraw ₹{amount || "0"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function AddMoneyModal({ visible, onClose, onConfirm }: AddMoneyModalProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("upi");
  const [loading, setLoading] = useState(false);

  const methods = [
    { id: "upi", name: "UPI", icon: "📱", fee: "Free" },
    { id: "card", name: "Credit/Debit Card", icon: "💳", fee: "2%" },
    { id: "netbanking", name: "Net Banking", icon: "🏦", fee: "Free" },
    { id: "wallet", name: "Digital Wallet", icon: "👛", fee: "1%" },
  ];

  const handleAddMoney = async () => {
    const addAmount = parseFloat(amount);

    if (!amount || addAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (addAmount < 10) {
      Alert.alert("Error", "Minimum amount is ₹10");
      return;
    }

    if (addAmount > 50000) {
      Alert.alert("Error", "Maximum amount per transaction is ₹50,000");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onConfirm(addAmount, method);
      setAmount("");
    }, 2000);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>➕ Add Money</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount to Add *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount (min ₹10)"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>

            {/* Quick Amount Buttons */}
            <View style={styles.quickAmounts}>
              <Text style={styles.sectionTitle}>Quick Select</Text>
              <View style={styles.quickAmountButtons}>
                {[100, 500, 1000, 2000, 5000].map((quickAmount) => (
                  <TouchableOpacity
                    key={quickAmount}
                    style={styles.quickAmountButton}
                    onPress={() => setAmount(quickAmount.toString())}
                  >
                    <Text style={styles.quickAmountText}>₹{quickAmount}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Payment Methods */}
            <View style={styles.methodSelector}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              {methods.map((paymentMethod) => (
                <TouchableOpacity
                  key={paymentMethod.id}
                  style={[
                    styles.paymentMethodOption,
                    method === paymentMethod.id && styles.paymentMethodSelected,
                  ]}
                  onPress={() => setMethod(paymentMethod.id)}
                >
                  <View style={styles.paymentMethodContent}>
                    <Text style={styles.paymentMethodIcon}>
                      {paymentMethod.icon}
                    </Text>
                    <View style={styles.paymentMethodDetails}>
                      <Text style={styles.paymentMethodName}>
                        {paymentMethod.name}
                      </Text>
                      <Text style={styles.paymentMethodFee}>
                        Fee: {paymentMethod.fee}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.radioButton,
                      method === paymentMethod.id && styles.radioButtonSelected,
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Security Info */}
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                🔒 Your payment is secured with bank-grade encryption
                {"\n"}📱 You'll be redirected to complete the payment
                {"\n"}⚡ Money will be added instantly upon successful payment
              </Text>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, loading && styles.buttonDisabled]}
              onPress={handleAddMoney}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>
                  Add ₹{amount || "0"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function WalletScreen() {
  const { theme } = useTheme();
  const { t } = useLocalization();
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<
    "all" | "referral" | "withdrawal" | "deposit"
  >("all");

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const mockBalance: WalletBalance = {
          current: 1850,
          pending: 150,
          total: 2000,
        };

        const mockTransactions: Transaction[] = [
          {
            id: "txn_001",
            date: "2024-01-20T10:30:00Z",
            amount: 50,
            type: "referral_bonus",
            description: "Referral bonus for inviting Adv. Priya Sharma",
            status: "completed",
            referenceId: "REF_PS_001",
            fromUser: "Priya Sharma",
          },
          {
            id: "txn_002",
            date: "2024-01-19T15:20:00Z",
            amount: -500,
            type: "withdrawal",
            description: "UPI transfer to 9876543210",
            status: "completed",
            referenceId: "WTH_001",
            toAccount: "9876543210@upi",
          },
          {
            id: "txn_003",
            date: "2024-01-18T09:45:00Z",
            amount: 1000,
            type: "deposit",
            description: "Money added via UPI",
            status: "completed",
            referenceId: "DEP_001",
          },
          {
            id: "txn_004",
            date: "2024-01-17T14:10:00Z",
            amount: 75,
            type: "referral_bonus",
            description: "Referral bonus for inviting Rajesh Kumar",
            status: "completed",
            referenceId: "REF_RK_002",
            fromUser: "Rajesh Kumar",
          },
          {
            id: "txn_005",
            date: "2024-01-16T11:30:00Z",
            amount: 25,
            type: "subscription_cashback",
            description: "Premium subscription cashback",
            status: "completed",
          },
          {
            id: "txn_006",
            date: "2024-01-15T16:45:00Z",
            amount: 50,
            type: "referral_bonus",
            description: "Referral bonus for inviting Amit Singh",
            status: "pending",
            referenceId: "REF_AS_003",
            fromUser: "Amit Singh",
          },
          {
            id: "txn_007",
            date: "2024-01-14T12:20:00Z",
            amount: 500,
            type: "deposit",
            description: "Money added via Credit Card",
            status: "completed",
            referenceId: "DEP_002",
          },
          {
            id: "txn_008",
            date: "2024-01-13T08:15:00Z",
            amount: -200,
            type: "withdrawal",
            description: "Bank transfer to SBI ****1234",
            status: "completed",
            referenceId: "WTH_002",
            toAccount: "SBI ****1234",
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
            onPress={() => router.push("/subscription")}
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
        return "📤";
      case "deposit":
        return "📥";
      case "adjustment":
        return "⚖️";
      default:
        return "💰";
    }
  };

  const getTransactionColor = (type: Transaction["type"], amount: number) => {
    if (amount > 0) return "#10b981";
    if (amount < 0) return "#ef4444";
    return "#6b7280";
  };

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "#10b981";
      case "pending":
        return "#f59e0b";
      case "failed":
        return "#ef4444";
      default:
        return "#6b7280";
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleWithdraw = (phone: string, amount: number, upiId?: string) => {
    setShowWithdrawModal(false);

    // Add new transaction
    const newTransaction: Transaction = {
      id: `txn_${Date.now()}`,
      date: new Date().toISOString(),
      amount: -amount,
      type: "withdrawal",
      description: upiId
        ? `UPI transfer to ${upiId}`
        : `Bank transfer to ${phone}`,
      status: "pending",
      referenceId: `WTH_${Date.now()}`,
      toAccount: upiId || phone,
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setBalance((prev) =>
      prev ? { ...prev, current: prev.current - amount } : null,
    );

    Alert.alert(
      "✅ Withdrawal Initiated",
      `Your withdrawal of ₹${amount} has been initiated. You'll receive the money within ${upiId ? "a few minutes" : "1-3 business days"}.`,
      [{ text: "OK" }],
    );
  };

  const handleAddMoney = (amount: number, method: string) => {
    setShowAddMoneyModal(false);

    // Redirect to payment options
    router.push({
      pathname: "/payment-options",
      params: {
        amount: amount.toString(),
        plan: "Add Money to Wallet",
        method,
      },
    });
  };

  const handleTransactionHistory = () => {
    setShowTransactionHistory(true);
  };

  const getFilteredTransactions = () => {
    if (historyFilter === "all") return transactions;

    const filterMap = {
      referral: ["referral_bonus", "subscription_cashback"],
      withdrawal: ["withdrawal"],
      deposit: ["deposit"],
    };

    return transactions.filter((t) =>
      filterMap[historyFilter]?.includes(t.type),
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#3b82f6" />
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>💰 My Wallet</Text>
          <Text style={styles.subtitle}>
            Track your earnings and manage payments
          </Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceTitle}>Current Balance</Text>
            <TouchableOpacity
              style={styles.hideButton}
              onPress={() => setBalanceHidden(!balanceHidden)}
            >
              <Text style={styles.hideButtonText}>
                {balanceHidden ? "👁️" : "🙈"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.balanceAmount}>
            {balanceHidden ? "₹ ••••••" : `₹${balance?.current || 0}`}
          </Text>

          <View style={styles.balanceDetails}>
            <View style={styles.balanceDetailItem}>
              <Text style={styles.balanceDetailLabel}>Pending</Text>
              <Text style={styles.balanceDetailValue}>
                {balanceHidden ? "•���••" : `₹${balance?.pending || 0}`}
              </Text>
            </View>
            <View style={styles.balanceDetailItem}>
              <Text style={styles.balanceDetailLabel}>Total Earned</Text>
              <Text style={styles.balanceDetailValue}>
                {balanceHidden ? "••••" : `₹${balance?.total || 0}`}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={() => setShowWithdrawModal(true)}
          >
            <Text style={styles.withdrawButtonText}>💸 Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.quickActionButtons}>
            <TouchableOpacity
              style={[styles.quickActionButton, styles.addMoneyButton]}
              onPress={() => setShowAddMoneyModal(true)}
            >
              <Text style={styles.quickActionIcon}>➕</Text>
              <Text style={styles.quickActionText}>Add Money</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionButton, styles.historyButton]}
              onPress={handleTransactionHistory}
            >
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={styles.quickActionText}>History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <Text style={styles.transactionsTitle}>Recent Transactions</Text>

          <View style={styles.transactionsList}>
            {transactions.slice(0, 5).length > 0 ? (
              transactions.slice(0, 5).map((transaction) => (
                <TouchableOpacity
                  key={transaction.id}
                  style={styles.transactionItem}
                  onPress={() => {
                    Alert.alert(
                      "Transaction Details",
                      `${transaction.description}\n\nAmount: ${formatAmount(transaction.amount)}\nDate: ${formatDate(transaction.date)}\nStatus: ${transaction.status.toUpperCase()}\n${transaction.referenceId ? `Reference: ${transaction.referenceId}` : ""}`,
                      [{ text: "OK" }],
                    );
                  }}
                >
                  <View style={styles.transactionIcon}>
                    <Text style={styles.transactionIconText}>
                      {getTransactionIcon(transaction.type)}
                    </Text>
                  </View>

                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    <View style={styles.transactionMeta}>
                      <Text style={styles.transactionDate}>
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
                      <Text style={styles.transactionRef}>
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
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyTransactions}>
                <Text style={styles.emptyTransactionsIcon}>📝</Text>
                <Text style={styles.emptyTransactionsText}>
                  No transactions yet
                </Text>
                <Text style={styles.emptyTransactionsSubtext}>
                  Your transactions will appear here
                </Text>
              </View>
            )}

            {transactions.length > 5 && (
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={handleTransactionHistory}
              >
                <Text style={styles.viewAllText}>View All Transactions →</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <WithdrawModal
        visible={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onConfirm={handleWithdraw}
        balance={balance?.current || 0}
      />

      <AddMoneyModal
        visible={showAddMoneyModal}
        onClose={() => setShowAddMoneyModal(false)}
        onConfirm={handleAddMoney}
      />

      {/* Transaction History Modal */}
      <Modal
        visible={showTransactionHistory}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTransactionHistory(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, styles.historyModalContainer]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📊 Transaction History</Text>
              <TouchableOpacity
                onPress={() => setShowTransactionHistory(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterTabs}>
              {[
                { key: "all", label: "All" },
                { key: "referral", label: "Referrals" },
                { key: "deposit", label: "Deposits" },
                { key: "withdrawal", label: "Withdrawals" },
              ].map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  style={[
                    styles.filterTab,
                    historyFilter === filter.key && styles.filterTabActive,
                  ]}
                  onPress={() => setHistoryFilter(filter.key as any)}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      historyFilter === filter.key &&
                        styles.filterTabTextActive,
                    ]}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <FlatList
              data={getFilteredTransactions()}
              keyExtractor={(item) => item.id}
              style={styles.historyList}
              renderItem={({ item }) => (
                <View style={styles.historyItem}>
                  <View style={styles.transactionIcon}>
                    <Text style={styles.transactionIconText}>
                      {getTransactionIcon(item.type)}
                    </Text>
                  </View>

                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionDescription}>
                      {item.description}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {formatDate(item.date)}
                    </Text>
                    {item.referenceId && (
                      <Text style={styles.transactionRef}>
                        Ref: {item.referenceId}
                      </Text>
                    )}
                    <View
                      style={[
                        styles.transactionStatus,
                        { backgroundColor: getStatusColor(item.status) },
                      ]}
                    >
                      <Text style={styles.transactionStatusText}>
                        {item.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.transactionAmount}>
                    <Text
                      style={[
                        styles.transactionAmountText,
                        {
                          color: getTransactionColor(item.type, item.amount),
                        },
                      ]}
                    >
                      {formatAmount(item.amount)}
                    </Text>
                  </View>
                </View>
              )}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyHistory}>
                  <Text style={styles.emptyIcon}>📝</Text>
                  <Text style={styles.emptyTitle}>No transactions found</Text>
                  <Text style={styles.emptySubtitle}>
                    No transactions match your selected filter
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
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
    marginTop: 16,
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
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#6b7280",
  },
  balanceCard: {
    backgroundColor: "#3b82f6",
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
  hideButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  hideButtonText: {
    fontSize: 16,
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
    marginBottom: 20,
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
  withdrawButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  withdrawButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  quickActions: {
    backgroundColor: "#fff",
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
    color: "#111827",
  },
  quickActionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  addMoneyButton: {
    backgroundColor: "#10b981",
  },
  historyButton: {
    backgroundColor: "#6366f1",
  },
  quickActionIcon: {
    fontSize: 18,
  },
  quickActionText: {
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
    color: "#111827",
  },
  transactionsList: {
    backgroundColor: "#fff",
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
    borderBottomColor: "#f3f4f6",
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
    color: "#111827",
  },
  transactionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: "#6b7280",
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
    color: "#6b7280",
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
    color: "#111827",
  },
  emptyTransactionsSubtext: {
    fontSize: 14,
    textAlign: "center",
    color: "#6b7280",
  },
  viewAllButton: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  viewAllText: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "600",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  historyModalContainer: {
    height: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#6b7280",
  },
  modalContent: {
    padding: 20,
    maxHeight: 400,
  },
  balanceInfo: {
    backgroundColor: "#f0f9ff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  balanceInfoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0284c7",
    textAlign: "center",
  },
  methodSelector: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  methodOptions: {
    flexDirection: "row",
    gap: 12,
  },
  methodOption: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  methodOptionSelected: {
    borderColor: "#3b82f6",
    backgroundColor: "#f0f9ff",
  },
  methodIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  methodText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  quickAmounts: {
    marginBottom: 20,
  },
  quickAmountButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickAmountButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  paymentMethodOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  paymentMethodSelected: {
    borderColor: "#3b82f6",
    backgroundColor: "#f0f9ff",
  },
  paymentMethodContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  paymentMethodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  paymentMethodFee: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d1d5db",
  },
  radioButtonSelected: {
    borderColor: "#3b82f6",
    backgroundColor: "#3b82f6",
  },
  infoBox: {
    backgroundColor: "#f0fdf4",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#22c55e",
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#166534",
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#3b82f6",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  // History Modal styles
  filterTabs: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: 0,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
  },
  filterTabActive: {
    backgroundColor: "#3b82f6",
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
  },
  filterTabTextActive: {
    color: "#fff",
  },
  historyList: {
    flex: 1,
    padding: 16,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 12,
  },
  emptyHistory: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});
