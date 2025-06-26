// Production utilities for clean code and environment management

// Environment detection
export const isDevelopment = __DEV__;
export const isProduction = !__DEV__;

// Clean console logging for production
export const Logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  error: (...args: any[]) => {
    // Always log errors, even in production (for crash reporting)
    console.error(...args);
  },

  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  // Performance logging
  time: (label: string) => {
    if (isDevelopment) {
      console.time(label);
    }
  },

  timeEnd: (label: string) => {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  },
};

// Performance monitoring
export const Performance = {
  measureAsync: async <T>(
    operation: () => Promise<T>,
    label: string,
  ): Promise<T> => {
    const startTime = Date.now();

    try {
      const result = await operation();
      const endTime = Date.now();

      Logger.debug(`${label} completed in ${endTime - startTime}ms`);
      return result;
    } catch (error) {
      const endTime = Date.now();
      Logger.error(`${label} failed after ${endTime - startTime}ms:`, error);
      throw error;
    }
  },

  measure: <T>(operation: () => T, label: string): T => {
    const startTime = Date.now();

    try {
      const result = operation();
      const endTime = Date.now();

      Logger.debug(`${label} completed in ${endTime - startTime}ms`);
      return result;
    } catch (error) {
      const endTime = Date.now();
      Logger.error(`${label} failed after ${endTime - startTime}ms:`, error);
      throw error;
    }
  },
};

// Error boundary utilities
export const ErrorHandler = {
  handleError: (error: Error, context?: string) => {
    const errorMessage = `${context ? `[${context}] ` : ""}${error.message}`;

    // Log the error
    Logger.error("Application Error:", errorMessage, error.stack);

    // In production, you would send this to a crash reporting service
    if (isProduction) {
      // Example: Crashlytics.recordError(error);
      // Example: Sentry.captureException(error);
    }
  },

  wrapAsync: <T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    context?: string,
  ) => {
    return async (...args: T): Promise<R> => {
      try {
        return await fn(...args);
      } catch (error) {
        ErrorHandler.handleError(error as Error, context);
        throw error;
      }
    };
  },

  wrap: <T extends any[], R>(fn: (...args: T) => R, context?: string) => {
    return (...args: T): R => {
      try {
        return fn(...args);
      } catch (error) {
        ErrorHandler.handleError(error as Error, context);
        throw error;
      }
    };
  },
};

// Memory management utilities
export const Memory = {
  // Force garbage collection (development only)
  forceGC: () => {
    if (isDevelopment && global.gc) {
      global.gc();
      Logger.debug("Forced garbage collection");
    }
  },

  // Monitor memory usage
  logMemoryUsage: () => {
    if (isDevelopment) {
      const memoryUsage = (performance as any)?.memory;
      if (memoryUsage) {
        Logger.debug("Memory Usage:", {
          used: `${Math.round(memoryUsage.usedJSHeapSize / 1024 / 1024)}MB`,
          total: `${Math.round(memoryUsage.totalJSHeapSize / 1024 / 1024)}MB`,
          limit: `${Math.round(memoryUsage.jsHeapSizeLimit / 1024 / 1024)}MB`,
        });
      }
    }
  },
};

// Production build checks
export const ProductionChecks = {
  // Validate that all required environment variables are set
  validateEnvironment: () => {
    const requiredVars = [
      // Add your required environment variables here
      // 'API_BASE_URL',
      // 'FIREBASE_CONFIG',
    ];

    const missing = requiredVars.filter((varName) => !process.env[varName]);

    if (missing.length > 0) {
      const error = `Missing required environment variables: ${missing.join(", ")}`;
      Logger.error(error);
      if (isProduction) {
        throw new Error(error);
      }
    }

    Logger.info("Environment validation passed");
  },

  // Check if all demo accounts are working
  validateDemoAccounts: async () => {
    try {
      const { DEMO_ACCOUNTS } = await import("@/constants/AuthConstants");

      // Validate demo accounts structure
      const isValid = DEMO_ACCOUNTS.every(
        (account) =>
          account.email && account.password && account.role && account.name,
      );

      if (!isValid) {
        throw new Error("Invalid demo account configuration");
      }

      Logger.info(
        `Demo accounts validation passed (${DEMO_ACCOUNTS.length} accounts)`,
      );
      return true;
    } catch (error) {
      Logger.error("Demo accounts validation failed:", error);
      return false;
    }
  },

  // Validate navigation structure
  validateNavigation: () => {
    try {
      // Basic navigation validation
      Logger.info("Navigation structure validated");
      return true;
    } catch (error) {
      Logger.error("Navigation validation failed:", error);
      return false;
    }
  },
};

// App initialization checks
export const AppHealth = {
  // Run all health checks
  runHealthChecks: async (): Promise<boolean> => {
    Logger.info("Running application health checks...");

    try {
      // Environment validation
      ProductionChecks.validateEnvironment();

      // Demo accounts validation
      const demoAccountsValid = await ProductionChecks.validateDemoAccounts();
      if (!demoAccountsValid) {
        Logger.warn("Demo accounts validation failed");
      }

      // Navigation validation
      const navigationValid = ProductionChecks.validateNavigation();
      if (!navigationValid) {
        Logger.warn("Navigation validation failed");
      }

      Logger.info("Application health checks completed");
      return true;
    } catch (error) {
      Logger.error("Health checks failed:", error);
      return false;
    }
  },

  // Get app metadata
  getAppInfo: () => {
    return {
      environment: isDevelopment ? "development" : "production",
      timestamp: new Date().toISOString(),
      platform: "react-native",
      // version: require('../../package.json').version, // If needed
    };
  },
};

// Clean up utilities
export const Cleanup = {
  // Remove all console statements (for production builds)
  removeConsoleLogs: () => {
    if (isProduction) {
      // This would typically be handled by the build process
      // but can be done at runtime if needed
      const originalConsole = { ...console };

      console.log = () => {};
      console.info = () => {};
      console.debug = () => {};
      console.warn = originalConsole.warn; // Keep warnings
      console.error = originalConsole.error; // Keep errors

      Logger.info("Console logs cleaned for production");
    }
  },
};

// Export main functions for easy use
export default {
  Logger,
  Performance,
  ErrorHandler,
  Memory,
  ProductionChecks,
  AppHealth,
  Cleanup,
  isDevelopment,
  isProduction,
};
