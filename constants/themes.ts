import { AppTheme, ThemeMode } from "@/types";

export const LIGHT_THEME: AppTheme = {
  colors: {
    primary: "#1e40af",
    secondary: "#7c3aed",
    background: "#f9fafb",
    surface: "#ffffff",
    text: "#111827",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    error: "#ef4444",
    success: "#10b981",
    warning: "#f59e0b",
    info: "#3b82f6",
  },
  typography: {
    sizes: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 24,
    },
    weights: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};

export const DARK_THEME: AppTheme = {
  colors: {
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    background: "#111827",
    surface: "#1f2937",
    text: "#f9fafb",
    textSecondary: "#9ca3af",
    border: "#374151",
    error: "#f87171",
    success: "#34d399",
    warning: "#fbbf24",
    info: "#60a5fa",
  },
  typography: {
    sizes: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 24,
    },
    weights: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};

export const MODERN_THEME: AppTheme = {
  colors: {
    primary: "#6366f1",
    secondary: "#ec4899",
    background: "#0f0f23",
    surface: "#1a1a2e",
    text: "#e2e8f0",
    textSecondary: "#94a3b8",
    border: "#334155",
    error: "#f43f5e",
    success: "#22c55e",
    warning: "#eab308",
    info: "#06b6d4",
  },
  typography: {
    sizes: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 24,
    },
    weights: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 18,
  },
};

export const THEME_CONFIG = {
  light: LIGHT_THEME,
  dark: DARK_THEME,
  modern: MODERN_THEME,
};

export const THEME_OPTIONS: {
  label: string;
  value: ThemeMode;
  icon: string;
}[] = [
  { label: "Light", value: "light", icon: "☀️" },
  { label: "Dark", value: "dark", icon: "🌙" },
  { label: "Modern", value: "modern", icon: "✨" },
  { label: "System Default", value: "system", icon: "📱" },
];

export const getSystemTheme = (): "light" | "dark" => {
  // In React Native, you'd use Appearance.getColorScheme()
  // For now, we'll default to light
  return "light";
};

export const resolveTheme = (themeMode: ThemeMode): AppTheme => {
  if (themeMode === "system") {
    const systemTheme = getSystemTheme();
    return THEME_CONFIG[systemTheme];
  }
  return THEME_CONFIG[themeMode] || LIGHT_THEME;
};
