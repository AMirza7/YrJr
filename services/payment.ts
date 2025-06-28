import { Alert } from "react-native";
// import RazorpayCheckout from 'react-native-razorpay'; // Real Razorpay SDK

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

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

class PaymentService {
  private readonly apiKey = "rzp_test_your_actual_key"; // Replace with actual Razorpay test key
  private readonly apiSecret = "your_actual_secret"; // Replace with actual secret
  private readonly baseUrl = "https://api.razorpay.com/v1";

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

  // Create Razorpay order on server
  private async createRazorpayOrder(
    plan: PaymentPlan,
  ): Promise<RazorpayOrder | null> {
    try {
      // In a real app, this would be a server-side API call
      // Example server endpoint: POST /api/payments/create-order
      const orderData = {
        amount: plan.price * 100, // Amount in paisa
        currency: plan.currency,
        receipt: `receipt_${plan.id}_${Date.now()}`,
        notes: {
          plan_id: plan.id,
          plan_name: plan.name,
        },
      };

      // For demo purposes, simulate the order creation
      // In production, replace this with actual API call
      const response = await this.simulateServerCall("/orders", orderData);

      if (response.success) {
        return {
          id: `order_${Date.now()}`,
          amount: orderData.amount,
          currency: orderData.currency,
          receipt: orderData.receipt,
          status: "created",
        };
      }

      return null;
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      return null;
    }
  }

  // Initialize Razorpay payment with real SDK
  async initiateRazorpayPayment(
    plan: PaymentPlan,
    userDetails: {
      name: string;
      email: string;
      phone: string;
    },
  ): Promise<{ success: boolean; paymentId?: string; error?: string }> {
    try {
      // Create order
      const order = await this.createRazorpayOrder(plan);
      if (!order) {
        return { success: false, error: "Failed to create payment order" };
      }

      // Razorpay payment options
      const options = {
        description: `Payment for ${plan.name} plan`,
        image: "https://your-app-logo-url.com/logo.png", // Replace with actual logo URL
        currency: plan.currency,
        key: this.apiKey,
        amount: order.amount,
        order_id: order.id,
        name: "YRJR Legal Assistant",
        prefill: {
          email: userDetails.email,
          contact: userDetails.phone,
          name: userDetails.name,
        },
        theme: {
          color: "#1e40af",
        },
        modal: {
          ondismiss: () => {
            console.log("Payment dismissed");
          },
        },
      };

      // Open Razorpay checkout
      // Uncomment when using real Razorpay SDK
      /*
      return new Promise((resolve) => {
        RazorpayCheckout.open(options)
          .then((data: RazorpayResponse) => {
            // Payment successful
            this.verifyPaymentSignature(data)
              .then((isValid) => {
                if (isValid) {
                  this.savePaymentHistory({
                    id: data.razorpay_payment_id,
                    planId: plan.id,
                    amount: plan.price,
                    currency: plan.currency,
                    status: "success",
                    date: new Date(),
                    transactionId: data.razorpay_order_id,
                    paymentMethod: "Razorpay",
                  });
                  resolve({ success: true, paymentId: data.razorpay_payment_id });
                } else {
                  resolve({ success: false, error: "Payment verification failed" });
                }
              });
          })
          .catch((error: any) => {
            console.error('Razorpay payment error:', error);
            resolve({ success: false, error: "Payment cancelled or failed" });
          });
      });
      */

      // For demo purposes, simulate the payment flow
      return this.simulateRazorpayPayment(order, userDetails, plan);
    } catch (error) {
      console.error("Payment initiation error:", error);
      return { success: false, error: "Payment initialization failed" };
    }
  }

  // UPI Payment with real UPI intent
  async initiateUPIPayment(
    plan: PaymentPlan,
    upiId: string = "yourmerchant@paytm", // Replace with actual UPI ID
  ): Promise<{
    success: boolean;
    upiLink?: string;
    error?: string;
  }> {
    try {
      const amount = plan.price;
      const merchantName = "YRJR Legal Assistant";
      const transactionNote = `Payment for ${plan.name} plan`;
      const transactionRef = `TXN${Date.now()}`;

      // Generate UPI payment link
      const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=${plan.currency}&tn=${encodeURIComponent(transactionNote)}&tr=${transactionRef}`;

      // You can also use Razorpay's UPI solution
      /*
      const upiOptions = {
        amount: amount * 100, // Amount in paisa
        currency: plan.currency,
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
        notes: {
          plan_id: plan.id,
          payment_method: 'UPI',
        },
      };
      */

      return { success: true, upiLink };
    } catch (error) {
      console.error("UPI payment error:", error);
      return { success: false, error: "Failed to generate UPI payment link" };
    }
  }

  // Verify Razorpay payment signature
  private async verifyPaymentSignature(
    response: RazorpayResponse,
  ): Promise<boolean> {
    try {
      // This should be done on your server for security
      // Send the response to your backend for verification

      const verificationData = {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      };

      // Example server verification endpoint
      const verificationResult = await this.simulateServerCall(
        "/verify-payment",
        verificationData,
      );

      return verificationResult.success;
    } catch (error) {
      console.error("Payment verification error:", error);
      return false;
    }
  }

  // Simulate server API calls (replace with real API calls)
  private async simulateServerCall(endpoint: string, data: any): Promise<any> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate 90% success rate
    const success = Math.random() > 0.1;

    return {
      success,
      data: success ? { ...data, id: `sim_${Date.now()}` } : null,
      error: success ? null : "Server error",
    };
  }

  // Simulate Razorpay payment for demo
  private async simulateRazorpayPayment(
    order: RazorpayOrder,
    userDetails: any,
    plan: PaymentPlan,
  ): Promise<{ success: boolean; paymentId?: string; error?: string }> {
    return new Promise((resolve) => {
      Alert.alert(
        "Razorpay Payment",
        `Proceed with payment for ${plan.name}?\n\nAmount: ₹${plan.price}\nOrder ID: ${order.id}`,
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () =>
              resolve({ success: false, error: "Payment cancelled by user" }),
          },
          {
            text: "Pay ₹" + plan.price,
            onPress: async () => {
              // Simulate payment processing
              await new Promise((resolve) => setTimeout(resolve, 2000));

              // Simulate 90% success rate
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
                  paymentMethod: "Razorpay (Demo)",
                });

                resolve({ success: true, paymentId });
              } else {
                resolve({
                  success: false,
                  error: "Payment failed. Please try again.",
                });
              }
            },
          },
        ],
      );
    });
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
          paymentMethod: "Razorpay",
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

      // You would typically send this to your backend
      /*
      await fetch('/api/payments/save-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify(payment),
      });
      */
    } catch (error) {
      console.error("Error saving payment history:", error);
    }
  }

  // Refund processing (server-side)
  async processRefund(
    paymentId: string,
    amount?: number,
  ): Promise<{
    success: boolean;
    refundId?: string;
    error?: string;
  }> {
    try {
      // This should be done on server-side using Razorpay API
      /*
      const refundData = {
        payment_id: paymentId,
        amount: amount ? amount * 100 : undefined, // Amount in paisa
      };

      const response = await fetch(`${this.baseUrl}/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(refundData),
      });

      const refund = await response.json();
      return { success: true, refundId: refund.id };
      */

      // Simulate refund processing
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const refundId = `rfnd_${Date.now()}`;
      return { success: true, refundId };
    } catch (error) {
      console.error("Refund processing error:", error);
      return { success: false, error: "Refund processing failed" };
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
      // Fetch from your backend
      /*
      const response = await fetch(`/api/subscriptions/${userId}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
      const subscription = await response.json();
      return subscription;
      */

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

  // Cancel subscription using Razorpay
  async cancelSubscription(subscriptionId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Cancel with Razorpay API
      /*
      const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64')}`,
        },
      });

      const result = await response.json();
      return { success: result.status === 'cancelled' };
      */

      return { success: true };
    } catch (error) {
      console.error("Subscription cancellation error:", error);
      return { success: false, error: "Failed to cancel subscription" };
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

  // Test payment flow with real success/failure callbacks
  async testPaymentFlow(plan: PaymentPlan, userDetails: any): Promise<boolean> {
    const result = await this.initiateRazorpayPayment(plan, userDetails);

    if (result.success) {
      Alert.alert(
        "Payment Successful!",
        `Your ${plan.name} subscription has been activated.\n\nPayment ID: ${result.paymentId}`,
        [{ text: "Continue" }],
      );
      return true;
    } else {
      Alert.alert(
        "Payment Failed",
        result.error || "Payment could not be processed. Please try again.",
        [{ text: "Retry" }],
      );
      return false;
    }
  }
}

export const paymentService = new PaymentService();
