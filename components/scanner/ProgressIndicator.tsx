import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface ProgressIndicatorProps {
  visible: boolean;
  title?: string;
  message?: string;
  progress?: number; // 0 to 1 for progress bar
  type?: "spinner" | "progress" | "upload";
}

export default function ProgressIndicator({
  visible,
  title = "Processing...",
  message = "Please wait while we process your document",
  progress,
  type = "spinner",
}: ProgressIndicatorProps) {
  const renderContent = () => {
    switch (type) {
      case "upload":
        return (
          <View style={styles.content}>
            <View style={styles.uploadIcon}>
              <Text style={styles.uploadIconText}>📤</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            {progress !== undefined && (
              <>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${progress * 100}%` },
                      ]}
                    />
                  </View>
                </View>
                <Text style={styles.progressText}>
                  {Math.round(progress * 100)}%
                </Text>
              </>
            )}
          </View>
        );

      case "progress":
        return (
          <View style={styles.content}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            {progress !== undefined && (
              <>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${progress * 100}%` },
                      ]}
                    />
                  </View>
                </View>
                <Text style={styles.progressText}>
                  {Math.round(progress * 100)}%
                </Text>
              </>
            )}
          </View>
        );

      default:
        return (
          <View style={styles.content}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.dotsContainer}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
          </View>
        );
    }
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>{renderContent()}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    marginHorizontal: 32,
    maxWidth: width - 64,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  content: {
    alignItems: "center",
  },
  uploadIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  uploadIconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
    marginTop: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  progressContainer: {
    width: "100%",
    marginTop: 16,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    fontWeight: "600",
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 4,
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3b82f6",
  },
  dot1: {
    animationDuration: "1s",
    animationIterationCount: "infinite",
    animationName: "pulse",
  },
  dot2: {
    animationDuration: "1s",
    animationIterationCount: "infinite",
    animationName: "pulse",
    animationDelay: "0.2s",
  },
  dot3: {
    animationDuration: "1s",
    animationIterationCount: "infinite",
    animationName: "pulse",
    animationDelay: "0.4s",
  },
});
