import { Alert, Platform } from "react-native";

interface ShareOptions {
  message: string;
  title?: string;
}

/**
 * Platform-aware sharing utility that handles web browser limitations
 */
export const shareContent = async (options: ShareOptions): Promise<void> => {
  const { message, title = "Share" } = options;

  // For web platform, use custom implementation
  if (Platform.OS === "web") {
    return handleWebShare(message, title);
  }

  // For native platforms, try React Native Share with fallback
  try {
    const { Share } = require("react-native");
    await Share.share({
      message,
      title,
    });
  } catch (error) {
    console.error("Native share failed:", error);
    return handleWebShare(message, title);
  }
};

/**
 * Web-specific sharing implementation with clipboard fallback
 */
const handleWebShare = async (
  message: string,
  title: string,
): Promise<void> => {
  // Try Web Share API first (if supported and allowed)
  if (navigator.share && window.isSecureContext) {
    try {
      await navigator.share({
        title,
        text: message,
      });
      return;
    } catch (error) {
      console.log("Web Share API failed, falling back to clipboard");
      // Continue to clipboard fallback
    }
  }

  // Fallback to clipboard + alert
  return showShareDialog(message, title);
};

/**
 * Show share dialog with copy to clipboard option
 */
const showShareDialog = (message: string, title: string): Promise<void> => {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      "Sharing is not available in this environment. You can copy the content to share it manually.",
      [
        {
          text: "OK",
          onPress: () => resolve(),
        },
        {
          text: "Copy to Clipboard",
          onPress: async () => {
            try {
              if (navigator?.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(message);
                Alert.alert("Success", "Content copied to clipboard!");
              } else {
                // Fallback for older browsers
                copyToClipboardFallback(message);
              }
            } catch (error) {
              console.error("Clipboard copy failed:", error);
              showTextToCopy(message);
            }
            resolve();
          },
        },
      ],
    );
  });
};

/**
 * Fallback clipboard method for older browsers
 */
const copyToClipboardFallback = (text: string): void => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
    Alert.alert("Success", "Content copied to clipboard!");
  } catch (error) {
    console.error("Fallback copy failed:", error);
    showTextToCopy(text);
  } finally {
    document.body.removeChild(textArea);
  }
};

/**
 * Show text in alert for manual copying
 */
const showTextToCopy = (text: string): void => {
  Alert.alert("Copy Manually", `Please copy this text manually:\n\n${text}`, [
    { text: "OK" },
  ]);
};

/**
 * Quick share for templates
 */
export const shareTemplate = (template: {
  title: string;
  description: string;
}): Promise<void> => {
  return shareContent({
    message: `Check out this legal template: ${template.title}\n\n${template.description}`,
    title: `Share Template: ${template.title}`,
  });
};

/**
 * Quick share for documents
 */
export const shareDocument = (content: string): Promise<void> => {
  return shareContent({
    message: content,
    title: "Share Document",
  });
};
