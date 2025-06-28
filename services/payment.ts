// Simple mock for payment service
export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

class PaymentService {
  async processPayment(amount: number): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: "txn_" + Date.now(),
    };
  }
}

export const paymentService = new PaymentService();
