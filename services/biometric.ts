// Simple biometric service
export const biometric = {
  isAvailable: () => Promise.resolve(false),
  authenticate: () => Promise.resolve(false),
};
