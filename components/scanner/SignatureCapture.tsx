import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import SignatureCanvas from "react-native-signature-canvas";
import { scannerService } from "@/services/scanner";
import { SignatureScanResult } from "@/types/scanner";
import { useModal } from "@/contexts/ModalContext";

const { width } = Dimensions.get("window");

interface SignatureCaptureProps {
  onSaveComplete?: (result: SignatureScanResult) => void;
  onClose?: () => void;
}

export default function SignatureCapture({
  onSaveComplete,
  onClose,
}: SignatureCaptureProps) {
  const signatureRef = useRef<any>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const { showAlert, showError, showSuccess, showConfirm } = useModal();

  const handleOK = (signature: string) => {
    setSignatureData(signature);
    setHasSignature(true);
  };

  const handleEmpty = () => {
    setHasSignature(false);
    setSignatureData(null);
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    setHasSignature(false);
    setSignatureData(null);
  };

  const handleSave = async () => {
    if (!signatureData) {
      showError("Please draw a signature before saving.");
      return;
    }

    try {
      const fileName = `signature_${Date.now()}.png`;
      const result = await scannerService.saveSignature(
        signatureData,
        fileName,
      );

      showSuccess("Your signature has been saved to your profile.");
      onSaveComplete?.(result);
    } catch (error) {
      showError("Failed to save signature. Please try again.");
    }
  };

  const handleUseOnPetition = () => {
    if (!signatureData) {
      showError("Please draw a signature before using it.");
      return;
    }

    showConfirm(
      "Use on Petition",
      "This will inject your signature into the petition PDF.",
      () => {
        showSuccess("Signature has been applied to the petition.");
      },
      "primary",
      "Use Signature",
    );
  };

  const style = `
    .m-signature-pad--footer {
      display: none;
    }
    body,html {
      width: 100%; height: 100%;
    }
    canvas {
      width: 100% !important;
      height: 100% !important;
    }
  `;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✍️ Signature Capture</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Draw your signature using your finger or stylus
        </Text>
      </View>

      <View style={styles.canvasContainer}>
        <SignatureCanvas
          ref={signatureRef}
          onOK={handleOK}
          onEmpty={handleEmpty}
          onClear={handleClear}
          autoClear={false}
          descriptionText=""
          clearText="Clear"
          confirmText="Done"
          webStyle={style}
          canvasProps={{
            width: width - 40,
            height: 200,
          }}
          backgroundColor="#ffffff"
          penColor="#000000"
          dotSize={2}
          minWidth={1}
          maxWidth={3}
        />
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, styles.clearButton]}
          onPress={handleClear}
        >
          <Text style={styles.clearButtonText}>🗑️ Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.saveButton,
            !hasSignature && styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={!hasSignature}
        >
          <Text
            style={[
              styles.saveButtonText,
              !hasSignature && styles.disabledButtonText,
            ]}
          >
            💾 Save Signature
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, !hasSignature && styles.disabledButton]}
          onPress={handleUseOnPetition}
          disabled={!hasSignature}
        >
          <Text
            style={[
              styles.actionButtonText,
              !hasSignature && styles.disabledButtonText,
            ]}
          >
            📄 Use on Petition
          </Text>
        </TouchableOpacity>
      </View>

      {/* Features */}
      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>✨ Signature Features</Text>

        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✍️</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Natural Drawing</Text>
              <Text style={styles.featureDescription}>
                Smooth signature capture with pressure sensitivity
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💾</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Save to Profile</Text>
              <Text style={styles.featureDescription}>
                Store signatures for reuse across documents
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📄</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>PDF Integration</Text>
              <Text style={styles.featureDescription}>
                Automatically inject signatures into petition PDFs
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔒</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Secure Storage</Text>
              <Text style={styles.featureDescription}>
                Encrypted signature storage with biometric protection
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Tips for Best Results</Text>
        <Text style={styles.tipItem}>
          • Use a stylus for more precise lines
        </Text>
        <Text style={styles.tipItem}>
          • Sign at normal speed for natural flow
        </Text>
        <Text style={styles.tipItem}>• Ensure good lighting for accuracy</Text>
        <Text style={styles.tipItem}>• Practice a few times before saving</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#ea580c",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  instructionsContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  instructionsText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
  canvasContainer: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    minHeight: 240,
  },
  controlsContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  controlButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  clearButtonText: {
    color: "#64748b",
    fontSize: 16,
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#ea580c",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#f1f5f9",
    opacity: 0.5,
  },
  disabledButtonText: {
    color: "#94a3b8",
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#8b5cf6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  featuresContainer: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 16,
  },
  tipsContainer: {
    backgroundColor: "#fef3c7",
    margin: 20,
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400e",
    marginBottom: 12,
  },
  tipItem: {
    fontSize: 13,
    color: "#a16207",
    marginBottom: 6,
    lineHeight: 18,
  },
});
