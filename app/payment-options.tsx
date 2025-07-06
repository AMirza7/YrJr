import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import BackButton from "@/components/navigation/BackButton";

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
}

interface PaymentModalProps {
  visible: boolean;
  method: PaymentMethod | null;
  amount: string;
  onClose: () => void;
  onSuccess: () => void;
}

function PaymentModal({
  visible,
  method,
  amount,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePayment = async () => {
    if (!method) return;

    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Payment Successful",
        `Payment of ₹${amount} completed successfully using ${method.name}`,
        [{ text: "OK", onPress: onSuccess }],
      );
    }, 2000);
  };

  const renderPaymentForm = () => {
    if (!method) return null;

    switch (method.id) {
      case "upi":
        return (
          <View style={styles.paymentForm}>
            <Text style={styles.formLabel}>UPI ID</Text>
            <TextInput
              style={styles.formInput}
              placeholder="yourname@upi"
              value={upiId}
              onChangeText={setUpiId}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.formHint}>
              Enter your UPI ID (e.g., yourname@paytm, yourname@googleplay)
            </Text>
          </View>
        );

      case "phonepe":
      case "googlepay":
        return (
          <View style={styles.paymentForm}>
            <Text style={styles.redirectText}>
              You will be redirected to {method.name} to complete the payment
            </Text>
          </View>
        );

      case "bankpay":
        return (
          <View style={styles.paymentForm}>
            <Text style={styles.redirectText}>
              You will be redirected to your bank's secure payment gateway
            </Text>
          </View>
        );

      case "card":
        return (
          <View style={styles.paymentForm}>
            <Text style={styles.formLabel}>Card Number</Text>
            <TextInput
              style={styles.formInput}
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
              maxLength={19}
            />

            <View style={styles.cardRow}>
              <View style={styles.cardField}>
                <Text style={styles.formLabel}>Expiry Date</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>

              <View style={styles.cardField}>
                <Text style={styles.formLabel}>CVV</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="123"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Complete Payment</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.paymentSummary}>
            <Text style={styles.summaryTitle}>Payment Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount</Text>
              <Text style={styles.summaryValue}>₹{amount}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Method</Text>
              <Text style={styles.summaryValue}>{method?.name}</Text>
            </View>
          </View>

          {renderPaymentForm()}

          <TouchableOpacity
            style={[styles.payButton, loading && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payButtonText}>Pay ₹{amount}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function PaymentOptionsScreen() {
  const params = useLocalSearchParams();
  const amount = (params.amount as string) || "499";
  const plan = (params.plan as string) || "Pro";
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: "upi",
      name: "UPI",
      icon: "📱",
      description: "Pay using any UPI app",
      enabled: true,
    },
    {
      id: "phonepe",
      name: "PhonePe",
      icon: "💜",
      description: "Pay with PhonePe wallet",
      enabled: true,
    },
    {
      id: "googlepay",
      name: "Google Pay",
      icon: "🔵",
      description: "Pay with Google Pay",
      enabled: true,
    },
    {
      id: "bankpay",
      name: "Bank Pay",
      icon: "🏦",
      description: "Net banking & bank transfers",
      enabled: true,
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: "💳",
      description: "Visa, Mastercard, RuPay",
      enabled: true,
    },
  ];

  const handleMethodSelect = (method: PaymentMethod) => {
    if (!method.enabled) {
      Alert.alert(
        "Not Available",
        "This payment method is currently unavailable",
      );
      return;
    }

    setSelectedMethod(method);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    Alert.alert(
      "Subscription Activated",
      `Your ${plan} subscription has been activated successfully!`,
      [
        {
          text: "OK",
          onPress: () => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(tabs)/home");
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton color="#fff" />
        <Text style={styles.title}>Payment Options</Text>
        <Text style={styles.subtitle}>
          Choose your preferred payment method
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Payment Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Subscription Details</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Plan</Text>
            <Text style={styles.summaryValue}>{plan}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration</Text>
            <Text style={styles.summaryValue}>1 Month</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{amount}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                !method.enabled && styles.methodCardDisabled,
              ]}
              onPress={() => handleMethodSelect(method)}
              disabled={!method.enabled}
            >
              <View style={styles.methodContent}>
                <Text style={styles.methodIcon}>{method.icon}</Text>
                <View style={styles.methodDetails}>
                  <Text
                    style={[
                      styles.methodName,
                      !method.enabled && styles.methodNameDisabled,
                    ]}
                  >
                    {method.name}
                  </Text>
                  <Text
                    style={[
                      styles.methodDescription,
                      !method.enabled && styles.methodDescriptionDisabled,
                    ]}
                  >
                    {method.description}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.methodArrow,
                    !method.enabled && styles.methodArrowDisabled,
                  ]}
                >
                  {method.enabled ? "›" : "⊗"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Text style={styles.securityIcon}>🔒</Text>
          <Text style={styles.securityText}>
            Your payment information is secure and encrypted. We don't store
            your card details.
          </Text>
        </View>
      </ScrollView>

      <PaymentModal
        visible={showPaymentModal}
        method={selectedMethod}
        amount={amount}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      />
    </View>
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
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  summaryValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  totalLabel: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 18,
    color: "#1e40af",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  methodCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  methodCardDisabled: {
    opacity: 0.5,
    backgroundColor: "#f9fafb",
  },
  methodContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  methodIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  methodDetails: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  methodNameDisabled: {
    color: "#9ca3af",
  },
  methodDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  methodDescriptionDisabled: {
    color: "#d1d5db",
  },
  methodArrow: {
    fontSize: 20,
    color: "#9ca3af",
  },
  methodArrowDisabled: {
    color: "#e5e7eb",
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9ff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  securityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  securityText: {
    fontSize: 14,
    color: "#1e40af",
    flex: 1,
    lineHeight: 20,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#1e40af",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  placeholder: {
    width: 26,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  paymentSummary: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  paymentForm: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  formHint: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: "row",
    gap: 12,
  },
  cardField: {
    flex: 1,
  },
  redirectText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    padding: 20,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    marginBottom: 20,
  },
  payButton: {
    backgroundColor: "#1e40af",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
