// Simple mock for SMS service
class SmsService {
  async sendVerificationCode(phoneNumber: string): Promise<string> {
    console.log("Sending SMS to:", phoneNumber);
    return "123456"; // Mock verification code
  }

  async verifyCode(code: string): Promise<boolean> {
    return code === "123456"; // Mock verification
  }
}

export const smsService = new SmsService();
