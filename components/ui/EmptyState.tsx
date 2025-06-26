import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

import { Button } from "@/components/ui/Button";
import { LegalTheme, FontSizes, FontWeights, Spacing } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

export type EmptyStateType =
  | "no_messages"
  | "no_documents"
  | "no_cases"
  | "no_court_orders"
  | "no_lawyers"
  | "no_notifications"
  | "no_search_results"
  | "no_calendar_events"
  | "no_templates"
  | "network_error"
  | "loading";

interface EmptyStateProps {
  type: EmptyStateType;
  title?: string;
  subtitle?: string;
  actionTitle?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
  showAnimation?: boolean;
  animationSize?: number;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  subtitle,
  actionTitle,
  onActionPress,
  style,
  showAnimation = true,
  animationSize = 150,
}) => {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  const getEmptyStateConfig = (type: EmptyStateType) => {
    const configs = {
      no_messages: {
        icon: "chatbubbles-outline",
        title: "No Conversations Yet",
        subtitle:
          "Start connecting with legal professionals and get the help you need.",
        actionTitle: "Start a Conversation",
        color: theme.primary,
        // In a real app, you would have actual Lottie animation files
        animationSource: undefined, // require('@/assets/animations/no-messages.json')
      },
      no_documents: {
        icon: "document-outline",
        title: "No Documents Found",
        subtitle:
          "Upload or scan your legal documents to get started with case management.",
        actionTitle: "Add Document",
        color: theme.secondary,
        animationSource: undefined,
      },
      no_cases: {
        icon: "briefcase-outline",
        title: "No Cases to Track",
        subtitle:
          "Add your legal cases to keep track of hearings and important updates.",
        actionTitle: "Add Case",
        color: theme.accent,
        animationSource: undefined,
      },
      no_court_orders: {
        icon: "library-outline",
        title: "No Court Orders",
        subtitle:
          "Stay updated with the latest court orders and judgments in your area.",
        actionTitle: "Browse Orders",
        color: theme.info,
        animationSource: undefined,
      },
      no_lawyers: {
        icon: "people-outline",
        title: "No Lawyers Found",
        subtitle:
          "Try adjusting your search criteria or location to find legal professionals.",
        actionTitle: "Update Search",
        color: theme.success,
        animationSource: undefined,
      },
      no_notifications: {
        icon: "notifications-outline",
        title: "All Caught Up!",
        subtitle:
          "You have no new notifications. We'll notify you when something important happens.",
        actionTitle: undefined,
        color: theme.primary,
        animationSource: undefined,
      },
      no_search_results: {
        icon: "search-outline",
        title: "No Results Found",
        subtitle: "Try using different keywords or check your spelling.",
        actionTitle: "Clear Search",
        color: theme.warning,
        animationSource: undefined,
      },
      no_calendar_events: {
        icon: "calendar-outline",
        title: "No Upcoming Events",
        subtitle:
          "Your legal calendar is clear. Add court hearings or important dates.",
        actionTitle: "Add Event",
        color: theme.primary,
        animationSource: undefined,
      },
      no_templates: {
        icon: "document-text-outline",
        title: "No Templates Available",
        subtitle:
          "Legal document templates will help you create professional documents quickly.",
        actionTitle: "Browse Templates",
        color: theme.secondary,
        animationSource: undefined,
      },
      network_error: {
        icon: "cloud-offline-outline",
        title: "Connection Problem",
        subtitle: "Please check your internet connection and try again.",
        actionTitle: "Retry",
        color: theme.error,
        animationSource: undefined,
      },
      loading: {
        icon: "hourglass-outline",
        title: "Loading...",
        subtitle: "Please wait while we fetch your data.",
        actionTitle: undefined,
        color: theme.primary,
        animationSource: undefined,
      },
    };

    return configs[type];
  };

  const config = getEmptyStateConfig(type);
  const displayTitle = title || config.title;
  const displaySubtitle = subtitle || config.subtitle;
  const displayActionTitle = actionTitle || config.actionTitle;

  const renderAnimation = () => {
    if (!showAnimation) return null;

    // If we have a Lottie animation source, use it
    if (config.animationSource) {
      return (
        <LottieView
          source={config.animationSource}
          style={{
            width: animationSize,
            height: animationSize,
          }}
          autoPlay
          loop
        />
      );
    }

    // Fallback to icon
    return (
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: config.color + "20",
            width: animationSize * 0.6,
            height: animationSize * 0.6,
            borderRadius: (animationSize * 0.6) / 2,
          },
        ]}
      >
        <Ionicons
          name={config.icon as any}
          size={animationSize * 0.3}
          color={config.color}
        />
      </View>
    );
  };

  const renderLoadingAnimation = () => {
    if (type !== "loading") return null;

    return (
      <LottieView
        source={require("@/assets/animations/loading.json")} // You would add this
        style={{
          width: animationSize,
          height: animationSize,
        }}
        autoPlay
        loop
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        {type === "loading" ? renderLoadingAnimation() : renderAnimation()}

        <Text style={[styles.title, { color: theme.text }]}>
          {displayTitle}
        </Text>

        {displaySubtitle && (
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {displaySubtitle}
          </Text>
        )}

        {displayActionTitle && onActionPress && (
          <Button
            title={displayActionTitle}
            onPress={onActionPress}
            style={styles.actionButton}
            size="medium"
            gradient
          />
        )}
      </View>
    </View>
  );
};

// Pre-configured empty states for common use cases
export const NoMessagesState: React.FC<Omit<EmptyStateProps, "type">> = (
  props,
) => <EmptyState type="no_messages" {...props} />;

export const NoDocumentsState: React.FC<Omit<EmptyStateProps, "type">> = (
  props,
) => <EmptyState type="no_documents" {...props} />;

export const NoCasesState: React.FC<Omit<EmptyStateProps, "type">> = (
  props,
) => <EmptyState type="no_cases" {...props} />;

export const NoCourtOrdersState: React.FC<Omit<EmptyStateProps, "type">> = (
  props,
) => <EmptyState type="no_court_orders" {...props} />;

export const NoLawyersState: React.FC<Omit<EmptyStateProps, "type">> = (
  props,
) => <EmptyState type="no_lawyers" {...props} />;

export const NoNotificationsState: React.FC<Omit<EmptyStateProps, "type">> = (
  props,
) => <EmptyState type="no_notifications" {...props} />;

export const NoSearchResultsState: React.FC<Omit<EmptyStateProps, "type">> = (
  props,
) => <EmptyState type="no_search_results" {...props} />;

export const NetworkErrorState: React.FC<Omit<EmptyStateProps, "type">> = (
  props,
) => <EmptyState type="network_error" {...props} />;

export const LoadingState: React.FC<Omit<EmptyStateProps, "type">> = (
  props,
) => <EmptyState type="loading" {...props} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxxl,
  },
  content: {
    alignItems: "center",
    maxWidth: 300,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: FontSizes.md,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  actionButton: {
    minWidth: 160,
  },
});
