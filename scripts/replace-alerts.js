// Script to find and replace remaining Alert.alert usages
// This helps identify components that still need modal conversion

const fs = require("fs");
const path = require("path");

function findAlertUsages(dir) {
  const files = fs.readdirSync(dir);
  const results = [];

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (
      stat.isDirectory() &&
      !file.startsWith(".") &&
      file !== "node_modules"
    ) {
      results.push(...findAlertUsages(filePath));
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      const content = fs.readFileSync(filePath, "utf8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        if (line.includes("Alert.alert")) {
          results.push({
            file: filePath,
            line: index + 1,
            content: line.trim(),
          });
        }
      });
    }
  });

  return results;
}

console.log("🔍 Scanning for remaining Alert.alert usages...\n");
const alertUsages = findAlertUsages("./");

if (alertUsages.length > 0) {
  console.log(`❌ Found ${alertUsages.length} remaining Alert.alert usages:\n`);

  alertUsages.forEach((usage) => {
    console.log(`📄 ${usage.file}:${usage.line}`);
    console.log(`   ${usage.content}\n`);
  });

  console.log(
    "💡 These should be replaced with useModal hooks from @/contexts/ModalContext",
  );
} else {
  console.log(
    "✅ No Alert.alert usages found! All modals have been converted.",
  );
}
