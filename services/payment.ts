import { Alert } from "react-native";

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration: "monthly" | "yearly";
  features: string[];
  popular?: boolean;
  discountPercentage?: number;
}

export interface PaymentMethod {
  id: string;
  type: "card" | "upi" | "netbanking" | "wallet";
  details: string;
  isDefault: boolean;
}

export interface PaymentHistory {
  id: string;
  planId: string;
  amount: number;
  currency: string;
  status: "success" | "pending" | "failed" | "refunded";
  date: Date;
  transactionId: string;
  paymentMethod: string;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

class PaymentService {
  private readonly apiKey = "rzp_test_demo_key"; // Demo key
  private readonly apiSecret = "demo_secret"; // Demo secret

  // Available subscription plans
  getAvailablePlans(): PaymentPlan[] {
    return [
      {
        id: "basic",
        name: "Basic",
        price: 0,
        currency: "INR",
        duration: "monthly",
        features: [
          "Basic legal templates",
          "5 document scans per month",
          "Basic search",
          "Email support",
        ],
      },
      {
        id: "pro",
        name: "Professional",
        price: 999,
        currency: "INR",
        duration: "monthly",
        features: [
          "All Basic features",
          "Unlimited document scans",
          "AI section comparator",
          "Voice search",
          "Biometric security",
          "Priority support",
          "Calendar integration",
        ],
        popular: true,
      },
      {
        id: "pro_yearly",
        name: "Professional (Yearly)",
        price: 9990,
        currency: "INR",
        duration: "yearly",
        features: [
          "All Professional features",
          "2 months free",
          "Advanced templates",
          "Export functionality",
        ],
        discountPercentage: 17,
      },
      {
        id: "premium",
        name: "Premium",
        price: 1999,
        currency: "INR",
        duration: "monthly",
        features: [
          "All Professional features",
          "White-label options",
          "API access",
          "Custom templates",
          "Video consultations",
          "24/7 phone support",
          "Advanced analytics",
        ],
      },
      {
        id: "premium_yearly",
        name: "Premium (Yearly)",
        price: 19990,
        currency: "INR",
        duration: "yearly",
        features: [
          "All Premium features",
          "2 months free",
          "Dedicated account manager",
          "Custom integrations",
        ],
        discountPercentage: 17,
      },
    ];
  }

  // Initialize Razorpay payment
  async initiatePayment(
    plan: PaymentPlan,
    userDetails: {
      name: string;
      email: string;
      phone: string;
    },
  ): Promise<{ success: boolean; paymentId?: string; error?: string }> {
    try {
      // Create order
      const order = await this.createOrder(plan);
      if (!order) {
        return { success: false, error: "Failed to create payment order" };
      }

      // In a real implementation, this would open Razorpay checkout
      // For demo purposes, we'll simulate the payment process
      return this.simulatePayment(order, userDetails, plan);
    } catch (error) {
      console.error("Payment initiation error:", error);
      return { success: false, error: "Payment initialization failed" };
    }
  }

  private async createOrder(plan: PaymentPlan): Promise<RazorpayOrder | null> {
    try {
      // Simulate API call to create Razorpay order
      const order: RazorpayOrder = {
        id: `order_${Date.now()}`,
        amount: plan.price * 100, // Razorpay expects amount in paisa
        currency: plan.currency,
        receipt: `receipt_${plan.id}_${Date.now()}`,
        status: "created",
      };

      return order;
    } catch (error) {
      console.error("Error creating order:", error);
      return null;
    }
  }

  private async simulatePayment(
    order: RazorpayOrder,
    userDetails: any,
    plan: PaymentPlan,
  ): Promise<{ success: boolean; paymentId?: string; error?: string }> {
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate payment success (90% success rate for demo)
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      const paymentId = `pay_${Date.now()}`;

      // Save payment history
      await this.savePaymentHistory({
        id: paymentId,
        planId: plan.id,
        amount: plan.price,
        currency: plan.currency,
        status: "success",
        date: new Date(),
        transactionId: order.id,
        paymentMethod: "UPI", // Demo method
      });

      return { success: true, paymentId };
    } else {
      return { success: false, error: "Payment failed. Please try again." };
    }
  }

  // UPI Payment
  async initiateUPIPayment(
    plan: PaymentPlan,
    upiId: string,
  ): Promise<{
    success: boolean;
    upiLink?: string;
    error?: string;
  }> {
    try {
      const amount = plan.price;
      const merchantName = "YRJR Legal Assistant";
      const transactionNote = `Payment for ${plan.name} plan`;

      // Generate UPI link
      const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=${plan.currency}&tn=${encodeURIComponent(transactionNote)}`;

      return { success: true, upiLink };
    } catch (error) {
      console.error("UPI payment error:", error);
      return { success: false, error: "Failed to generate UPI payment link" };
    }
  }

  // Payment verification
  async verifyPayment(
    paymentId: string,
    orderId: string,
    signature: string,
  ): Promise<boolean> {
    try {
      // In real implementation, verify signature with Razorpay
      // For demo, we'll always return true
      return true;
    } catch (error) {
      console.error("Payment verification error:", error);
      return false;
    }
  }

  // Get payment history
  async getPaymentHistory(userId: string): Promise<PaymentHistory[]> {
    try {
      // In real app, fetch from backend
      // For demo, return mock data
      return [
        {
          id: "pay_123",
          planId: "pro",
          amount: 999,
          currency: "INR",
          status: "success",
          date: new Date("2024-01-15"),
          transactionId: "order_123",
          paymentMethod: "UPI",
        },
        {
          id: "pay_124",
          planId: "basic",
          amount: 0,
          currency: "INR",
          status: "success",
          date: new Date("2024-01-01"),
          transactionId: "order_124",
          paymentMethod: "Free Trial",
        },
      ];
    } catch (error) {
      console.error("Error fetching payment history:", error);
      return [];
    }
  }

  private async savePaymentHistory(payment: PaymentHistory): Promise<void> {
    try {
      // In real app, save to backend
      console.log("Payment saved:", payment);
    } catch (error) {
      console.error("Error saving payment history:", error);
    }
  }

  // Refund processing
  async processRefund(
    paymentId: string,
    amount?: number,
  ): Promise<{
    success: boolean;
    refundId?: string;
    error?: string;
  }> {
    try {
      // Simulate refund processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const refundId = `rfnd_${Date.now()}`;
      return { success: true, refundId };
    } catch (error) {
      console.error("Refund processing error:", error);
      return { success: false, error: "Refund processing failed" };
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // In real implementation, cancel with Razorpay
      return { success: true };
    } catch (error) {
      console.error("Subscription cancellation error:", error);
      return { success: false, error: "Failed to cancel subscription" };
    }
  }

  // Get current subscription status
  async getSubscriptionStatus(userId: string): Promise<{
    isActive: boolean;
    planId: string;
    expiryDate: Date;
    autoRenew: boolean;
  }> {
    try {
      // Mock subscription status
      return {
        isActive: true,
        planId: "pro",
        expiryDate: new Date("2025-02-15"),
        autoRenew: true,
      };
    } catch (error) {
      console.error("Error fetching subscription status:", error);
      return {
        isActive: false,
        planId: "basic",
        expiryDate: new Date(),
        autoRenew: false,
      };
    }
  }

  // Payment methods management
  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    return [
      {
        id: "pm_1",
        type: "card",
        details: "**** **** **** 1234",
        isDefault: true,
      },
      {
        id: "pm_2",
        type: "upi",
        details: "user@paytm",
        isDefault: false,
      },
    ];
  }

  async addPaymentMethod(
    method: Omit<PaymentMethod, "id">,
  ): Promise<string | null> {
    try {
      const id = `pm_${Date.now()}`;
      return id;
    } catch (error) {
      console.error("Error adding payment method:", error);
      return null;
    }
  }

  async removePaymentMethod(methodId: string): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      console.error("Error removing payment method:", error);
      return false;
    }
  }

  // Pricing calculations
  calculateDiscount(originalPrice: number, discountPercentage: number): number {
    return Math.round(originalPrice * (discountPercentage / 100));
  }

  calculateFinalPrice(
    originalPrice: number,
    discountPercentage: number = 0,
  ): number {
    return (
      originalPrice - this.calculateDiscount(originalPrice, discountPercentage)
    );
  }

  formatCurrency(amount: number, currency: string = "INR"): string {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
    }).format(amount);
  }

  // Payment analytics
  async getPaymentAnalytics(userId: string): Promise<{
    totalSpent: number;
    activeSubscriptions: number;
    nextBillingDate: Date;
    savingsFromAnnual: number;
  }> {
    const history = await this.getPaymentHistory(userId);
    const totalSpent = history
      .filter((h) => h.status === "success")
      .reduce((sum, h) => sum + h.amount, 0);

    return {
      totalSpent,
      activeSubscriptions: 1,
      nextBillingDate: new Date("2025-02-15"),
      savingsFromAnnual: 1998, // 2 months free on yearly plan
    };
  }

  // Demo functions for testing
  simulatePaymentFlow(plan: PaymentPlan): Promise<boolean> {
    return new Promise((resolve) => {
      Alert.alert(
        "Demo Payment",
        `Simulating payment for ${plan.name} plan (₹${plan.price})`,
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => resolve(false),
          },
          {
            text: "Pay Now",
            onPress: () => {
              setTimeout(() => {
                Alert.alert(
                  "Payment Success!",
                  "Your subscription has been activated.",
                );
                resolve(true);
              }, 2000);
            },
          },
        ],
      );
    });
  }
}

export const paymentService = new PaymentService();
