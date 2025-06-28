#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Simple bundle analysis for Expo
function analyzeBundleSize() {
  console.log("🔍 Analyzing bundle size...\n");

  try {
    // Get current package.json
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    const dependencies = Object.keys(packageJson.dependencies || {});
    const devDependencies = Object.keys(packageJson.devDependencies || {});

    console.log("📦 Current Dependencies:");
    console.log(`  Production: ${dependencies.length} packages`);
    console.log(`  Development: ${devDependencies.length} packages\n`);

    // Analyze package sizes
    const heavyPackages = [];
    dependencies.forEach((pkg) => {
      try {
        const packagePath = path.join("node_modules", pkg);
        if (fs.existsSync(packagePath)) {
          const stat = fs.statSync(packagePath);
          if (stat.isDirectory()) {
            const size = getDirSize(packagePath);
            if (size > 1024 * 1024) {
              // > 1MB
              heavyPackages.push({ name: pkg, size: formatBytes(size) });
            }
          }
        }
      } catch (e) {
        // Skip if package not found
      }
    });

    console.log("🐘 Heavy Packages (>1MB):");
    heavyPackages
      .sort((a, b) => parseFloat(b.size) - parseFloat(a.size))
      .forEach((pkg) => {
        console.log(`  ${pkg.name}: ${pkg.size}`);
      });

    // Platform-specific analysis
    console.log("\n🎯 Platform-specific optimizations needed:");

    const nativeOnlyPackages = [
      "expo-camera",
      "expo-local-authentication",
      "expo-secure-store",
      "expo-media-library",
      "expo-sms",
      "react-native-razorpay",
    ];

    const webBloat = nativeOnlyPackages.filter((pkg) =>
      dependencies.includes(pkg),
    );
    if (webBloat.length > 0) {
      console.log("  ⚠️  Native-only packages loaded on web:");
      webBloat.forEach((pkg) => console.log(`     - ${pkg}`));
    }

    // Recommendations
    console.log("\n💡 Optimization Recommendations:");
    console.log("  1. Use dynamic imports for heavy features");
    console.log("  2. Platform-specific bundles for native vs web");
    console.log("  3. Lazy load authentication screens");
    console.log("  4. Remove unused dependencies");
    console.log("  5. Use React.memo for expensive components");

    // Create optimization report
    const report = {
      timestamp: new Date().toISOString(),
      totalDependencies: dependencies.length,
      heavyPackages: heavyPackages.length,
      webBloat: webBloat.length,
      packages: {
        heavy: heavyPackages,
        webBloat,
        all: dependencies,
      },
    };

    fs.writeFileSync("bundle-analysis.json", JSON.stringify(report, null, 2));
    console.log("\n📊 Report saved to bundle-analysis.json");
  } catch (error) {
    console.error("Error analyzing bundle:", error.message);
  }
}

function getDirSize(dirPath) {
  let size = 0;
  try {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      if (stat.isFile()) {
        size += stat.size;
      } else if (stat.isDirectory() && item !== "node_modules") {
        size += getDirSize(itemPath);
      }
    }
  } catch (e) {
    // Skip inaccessible directories
  }
  return size;
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

if (require.main === module) {
  analyzeBundleSize();
}

module.exports = { analyzeBundleSize };
