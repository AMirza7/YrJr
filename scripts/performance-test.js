#!/usr/bin/env node

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

class PerformanceTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      tests: {},
    };
  }

  async runTest(name, testFn) {
    console.log(`🔍 Running ${name}...`);
    const startTime = Date.now();

    try {
      const result = await testFn();
      const duration = Date.now() - startTime;

      this.results.tests[name] = {
        success: true,
        duration,
        result,
      };

      console.log(`✅ ${name} completed in ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.results.tests[name] = {
        success: false,
        duration,
        error: error.message,
      };

      console.log(`❌ ${name} failed in ${duration}ms: ${error.message}`);
      throw error;
    }
  }

  async testBundleSize() {
    return this.runTest("Bundle Size Analysis", async () => {
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
      const dependencies = Object.keys(packageJson.dependencies || {});

      // Analyze dependencies
      const analysis = {
        totalDependencies: dependencies.length,
        heavyPackages: [],
        mobileOnlyPackages: [],
        webOptimized: false,
      };

      // Check for mobile-only packages that should be lazy-loaded
      const mobileOnlyPkgs = [
        "expo-camera",
        "expo-local-authentication",
        "expo-secure-store",
        "expo-media-library",
        "expo-sms",
        "react-native-razorpay",
      ];

      analysis.mobileOnlyPackages = mobileOnlyPkgs.filter((pkg) =>
        dependencies.includes(pkg),
      );

      // Check if we've moved them to peerDependencies
      const peerDeps = Object.keys(packageJson.peerDependencies || {});
      analysis.webOptimized = mobileOnlyPkgs.every(
        (pkg) => !dependencies.includes(pkg) || peerDeps.includes(pkg),
      );

      return analysis;
    });
  }

  async testLandingPagePerformance() {
    return this.runTest("Landing Page Performance", async () => {
      // Check if optimized landing page exists
      const optimizedExists = fs.existsSync("app/landing.optimized.tsx");
      const originalExists = fs.existsSync("app/landing.tsx");

      // Analyze file sizes
      const sizes = {};

      if (optimizedExists) {
        const optimizedContent = fs.readFileSync(
          "app/landing.optimized.tsx",
          "utf8",
        );
        sizes.optimized = {
          characters: optimizedContent.length,
          lines: optimizedContent.split("\n").length,
          imports: (optimizedContent.match(/^import/gm) || []).length,
        };
      }

      if (originalExists) {
        const originalContent = fs.readFileSync("app/landing.tsx", "utf8");
        sizes.original = {
          characters: originalContent.length,
          lines: originalContent.split("\n").length,
          imports: (originalContent.match(/^import/gm) || []).length,
        };
      }

      return {
        optimizedExists,
        originalExists,
        sizes,
        improvement:
          sizes.optimized && sizes.original
            ? {
                characterReduction:
                  (
                    ((sizes.original.characters - sizes.optimized.characters) /
                      sizes.original.characters) *
                    100
                  ).toFixed(2) + "%",
                importReduction:
                  sizes.original.imports - sizes.optimized.imports,
              }
            : null,
      };
    });
  }

  async testLazyLoadingImplementation() {
    return this.runTest("Lazy Loading Implementation", async () => {
      const checks = {
        platformSpecificServices: false,
        lazyComponents: false,
        dynamicImports: false,
        performanceMonitoring: false,
      };

      // Check for platform-specific services
      if (fs.existsSync("services/biometric.platform.ts")) {
        checks.platformSpecificServices = true;
      }

      // Check for lazy loading in layout
      if (fs.existsSync("app/_layout.tsx")) {
        const layoutContent = fs.readFileSync("app/_layout.tsx", "utf8");
        if (
          layoutContent.includes("lazy: true") ||
          layoutContent.includes("React.lazy")
        ) {
          checks.lazyComponents = true;
        }
        if (
          layoutContent.includes("import(") ||
          layoutContent.includes("await import")
        ) {
          checks.dynamicImports = true;
        }
      }

      // Check for performance monitoring
      if (fs.existsSync("utils/performance.ts")) {
        checks.performanceMonitoring = true;
      }

      const score = Object.values(checks).filter(Boolean).length;
      return {
        checks,
        score: `${score}/4`,
        percentage: ((score / 4) * 100).toFixed(0) + "%",
      };
    });
  }

  async testMetroConfiguration() {
    return this.runTest("Metro Configuration", async () => {
      const metroExists = fs.existsSync("metro.config.js");
      const appConfigExists = fs.existsSync("app.config.js");

      let metroOptimizations = [];
      let appConfigOptimizations = [];

      if (metroExists) {
        const metroContent = fs.readFileSync("metro.config.js", "utf8");

        if (metroContent.includes("blockList")) {
          metroOptimizations.push("Package exclusion for web");
        }
        if (metroContent.includes("cacheStores")) {
          metroOptimizations.push("Cache optimization");
        }
        if (metroContent.includes("minifierConfig")) {
          metroOptimizations.push("Bundle minification");
        }
      }

      if (appConfigExists) {
        const appConfigContent = fs.readFileSync("app.config.js", "utf8");

        if (appConfigContent.includes("jsEngine")) {
          appConfigOptimizations.push("Hermes JS engine");
        }
        if (appConfigContent.includes("enableLazyLoading")) {
          appConfigOptimizations.push("Lazy loading enabled");
        }
        if (appConfigContent.includes("platformSpecificBundles")) {
          appConfigOptimizations.push("Platform-specific bundles");
        }
      }

      return {
        metroExists,
        appConfigExists,
        metroOptimizations,
        appConfigOptimizations,
        totalOptimizations:
          metroOptimizations.length + appConfigOptimizations.length,
      };
    });
  }

  async generateReport() {
    console.log("\n📊 Performance Optimization Report");
    console.log("=====================================\n");

    try {
      await this.testBundleSize();
      await this.testLandingPagePerformance();
      await this.testLazyLoadingImplementation();
      await this.testMetroConfiguration();

      // Calculate overall score
      const tests = Object.values(this.results.tests);
      const successfulTests = tests.filter((test) => test.success).length;
      const overallScore = ((successfulTests / tests.length) * 100).toFixed(0);

      console.log("\n📈 Summary:");
      console.log(
        `Overall Score: ${overallScore}% (${successfulTests}/${tests.length} tests passed)`,
      );

      // Generate recommendations
      this.generateRecommendations();

      // Save report
      const reportPath = "performance-report.json";
      fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
      console.log(`\n💾 Full report saved to ${reportPath}`);

      return this.results;
    } catch (error) {
      console.error("\n❌ Performance test failed:", error.message);
      return null;
    }
  }

  generateRecommendations() {
    console.log("\n💡 Optimization Recommendations:");

    const bundleTest = this.results.tests["Bundle Size Analysis"];
    if (
      bundleTest?.success &&
      bundleTest.result.mobileOnlyPackages.length > 0
    ) {
      console.log("  🔄 Move mobile-only packages to peerDependencies");
      bundleTest.result.mobileOnlyPackages.forEach((pkg) => {
        console.log(`     - ${pkg}`);
      });
    }

    const landingTest = this.results.tests["Landing Page Performance"];
    if (landingTest?.success && !landingTest.result.optimizedExists) {
      console.log("  🚀 Create optimized landing page");
    }

    const lazyTest = this.results.tests["Lazy Loading Implementation"];
    if (lazyTest?.success && lazyTest.result.score !== "4/4") {
      console.log("  ⚡ Implement missing lazy loading features");
      Object.entries(lazyTest.result.checks).forEach(([check, implemented]) => {
        if (!implemented) {
          console.log(`     - ${check}`);
        }
      });
    }

    const metroTest = this.results.tests["Metro Configuration"];
    if (metroTest?.success && metroTest.result.totalOptimizations < 5) {
      console.log("  ⚙️  Add more Metro optimizations");
    }
  }
}

// Run performance tests
if (require.main === module) {
  const tester = new PerformanceTester();
  tester.generateReport().then((results) => {
    if (results) {
      console.log("\n🎉 Performance analysis complete!");
      process.exit(0);
    } else {
      process.exit(1);
    }
  });
}

module.exports = { PerformanceTester };
