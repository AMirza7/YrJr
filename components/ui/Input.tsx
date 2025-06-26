import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  LegalTheme,
  BorderRadius,
  FontSizes,
  Spacing,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  maxLength?: number;
  editable?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  disabled = false,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = "default",
  autoCapitalize = "none",
  autoComplete,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
  maxLength,
  editable = true,
}) => {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyles = (): ViewStyle => ({
    marginBottom: Spacing.md,
  });

  const getInputContainerStyles = (): ViewStyle => ({
    flexDirection: "row",
    alignItems: multiline ? "flex-start" : "center",
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: error ? theme.error : isFocused ? theme.primary : theme.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: multiline ? Spacing.md : Spacing.sm,
    minHeight: multiline ? 80 : 48,
  });

  const getInputStyles = (): TextStyle => ({
    flex: 1,
    fontSize: FontSizes.md,
    color: theme.text,
    textAlignVertical: multiline ? "top" : "center",
    paddingLeft: leftIcon ? Spacing.sm : 0,
    paddingRight: rightIcon ? Spacing.sm : 0,
  });

  const getLabelStyles = (): TextStyle => ({
    fontSize: FontSizes.sm,
    fontWeight: "500",
    color: theme.text,
    marginBottom: Spacing.xs,
  });

  const getErrorStyles = (): TextStyle => ({
    fontSize: FontSizes.sm,
    color: theme.error,
    marginTop: Spacing.xs,
  });

  return (
    <View style={[getContainerStyles(), style]}>
      {label && <Text style={getLabelStyles()}>{label}</Text>}

      <View style={getInputContainerStyles()}>
        {leftIcon && (
          <Ionicons
            name={leftIcon as any}
            size={20}
            color={theme.textSecondary}
          />
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textTertiary}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete as any}
          editable={editable && !disabled}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[getInputStyles(), inputStyle]}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            <Ionicons
              name={rightIcon as any}
              size={20}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={getErrorStyles()}>{error}</Text>}
    </View>
  );
};
