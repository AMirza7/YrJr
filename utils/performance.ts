import { Platform } from "react-native";

export interface PerformanceMetrics {
  renderTime: number;
  bundleSize: number;
  platform: string;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private startTimes: Map<string, number> = new Map();

  startMeasure(name: string): void {
    this.startTimes.set(name, Date.now());

    // Use platform-specific performance APIs
    if (Platform.OS === "web" && typeof performance !== "undefined") {
      performance.mark(`${name}-start`);
    }
  }

  endMeasure(name: string): number {
    const startTime = this.startTimes.get(name);
    if (!startTime) return 0;

    const endTime = Date.now();
    const duration = endTime - startTime;

    if (Platform.OS === "web" && typeof performance !== "undefined") {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    }

    this.startTimes.delete(name);
    return duration;
  }

  recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);

    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getAverageRenderTime(): number {
    if (this.metrics.length === 0) return 0;
    const total = this.metrics.reduce(
      (sum, metric) => sum + metric.renderTime,
      0,
    );
    return total / this.metrics.length;
  }

  // Web-specific bundle size estimation
  estimateBundleSize(): Promise<number> {
    return new Promise((resolve) => {
      if (Platform.OS === "web" && typeof performance !== "undefined") {
        // Use Navigation Timing API
        const navigation = performance.getEntriesByType("navigation")[0] as any;
        if (navigation) {
          resolve(navigation.transferSize || 0);
        } else {
          resolve(0);
        }
      } else {
        // For mobile, estimate based on JS heap
        resolve(0);
      }
    });
  }

  // Memory usage monitoring
  getMemoryUsage(): number {
    if (Platform.OS === "web" && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  // Clear metrics for privacy
  clearMetrics(): void {
    this.metrics = [];
    this.startTimes.clear();
  }

  // Export metrics for analysis
  exportMetrics(): string {
    return JSON.stringify(
      {
        platform: Platform.OS,
        version: Platform.Version,
        metrics: this.metrics,
        averageRenderTime: this.getAverageRenderTime(),
        memoryUsage: this.getMemoryUsage(),
        timestamp: Date.now(),
      },
      null,
      2,
    );
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Performance-aware component wrapper
export function withPerformanceMonitoring<T extends {}>(
  Component: React.ComponentType<T>,
  componentName: string,
) {
  return React.memo((props: T) => {
    React.useEffect(() => {
      performanceMonitor.startMeasure(`${componentName}-render`);

      return () => {
        const renderTime = performanceMonitor.endMeasure(
          `${componentName}-render`,
        );
        if (renderTime > 0) {
          performanceMonitor.recordMetric({
            renderTime,
            bundleSize: 0,
            platform: Platform.OS,
            timestamp: Date.now(),
          });
        }
      };
    }, []);

    return React.createElement(Component, props);
  });
}

// Bundle loading utility
export const loadBundle = async (bundleName: string): Promise<any> => {
  performanceMonitor.startMeasure(`bundle-${bundleName}`);

  try {
    let module;

    switch (bundleName) {
      case "auth":
        module = await import("@/services/auth");
        break;
      case "biometric":
        module = await import("@/services/biometric.platform");
        break;
      case "camera":
        module = await import("@/services/camera.platform");
        break;
      case "notifications":
        module = await import("@/services/notifications");
        break;
      default:
        throw new Error(`Unknown bundle: ${bundleName}`);
    }

    const loadTime = performanceMonitor.endMeasure(`bundle-${bundleName}`);
    console.log(`📦 Bundle '${bundleName}' loaded in ${loadTime}ms`);

    return module;
  } catch (error) {
    console.error(`❌ Failed to load bundle '${bundleName}':`, error);
    throw error;
  }
};

// First paint detection for web
export const measureFirstPaint = (): Promise<number> => {
  return new Promise((resolve) => {
    if (Platform.OS === "web" && typeof performance !== "undefined") {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstPaint = entries.find(
          (entry) => entry.name === "first-paint",
        );
        if (firstPaint) {
          resolve(firstPaint.startTime);
          observer.disconnect();
        }
      });

      observer.observe({ entryTypes: ["paint"] });

      // Fallback timeout
      setTimeout(() => {
        resolve(0);
        observer.disconnect();
      }, 5000);
    } else {
      resolve(0);
    }
  });
};
