import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  LegalTheme,
  BorderRadius,
  FontSizes,
  Spacing,
  Shadows,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: (text: string) => void;
  onVoicePress?: () => void;
  onFilterPress?: () => void;
  style?: ViewStyle;
  showVoice?: boolean;
  showFilter?: boolean;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search legal cases, IPC, CrPC...",
  value,
  onChangeText,
  onSearch,
  onVoicePress,
  onFilterPress,
  style,
  showVoice = true,
  showFilter = true,
  autoFocus = false,
}) => {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (onSearch) {
      onSearch(value);
    }
  };

  const getContainerStyles = (): ViewStyle => ({
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: isFocused ? theme.primary : theme.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 48,
    ...Shadows.sm,
  });

  const getInputStyles = () => ({
    flex: 1,
    fontSize: FontSizes.md,
    color: theme.text,
    paddingHorizontal: Spacing.sm,
  });

  const getIconButtonStyles = () => ({
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  });

  return (
    <View style={[getContainerStyles(), style]}>
      <Ionicons name="search" size={20} color={theme.textSecondary} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textTertiary}
        style={getInputStyles()}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        autoFocus={autoFocus}
      />

      {showVoice && (
        <TouchableOpacity onPress={onVoicePress} style={getIconButtonStyles()}>
          <Ionicons name="mic" size={20} color={theme.primary} />
        </TouchableOpacity>
      )}

      {showFilter && (
        <TouchableOpacity onPress={onFilterPress} style={getIconButtonStyles()}>
          <Ionicons name="options" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};
