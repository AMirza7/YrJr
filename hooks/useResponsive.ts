import { useState, useEffect } from "react";
import { Dimensions, PixelRatio } from "react-native";
import {
  Breakpoints,
  getResponsiveSpacing,
  getResponsiveFontSize,
} from "@/constants/Theme";

interface ScreenDimensions {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

interface ResponsiveValues {
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isLargeScreen: boolean;
  isTablet: boolean;
  isLandscape: boolean;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  fontScale: number;

  // Helper functions
  wp: (percentage: number) => number; // Width percentage
  hp: (percentage: number) => number; // Height percentage
  sp: (spacing: number) => number; // Responsive spacing
  fs: (fontSize: number) => number; // Responsive font size

  // Safe area calculations
  headerHeight: number;
  contentHeight: number;

  // Responsive values
  cardColumns: number;
  gridSpacing: number;
  containerPadding: number;

  // Typography scale
  typography: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
}

export const useResponsive = (): ResponsiveValues => {
  const [dimensions, setDimensions] = useState<ScreenDimensions>(() => {
    const { width, height } = Dimensions.get("window");
    return {
      width,
      height,
      scale: PixelRatio.get(),
      fontScale: PixelRatio.getFontScale(),
    };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
        scale: PixelRatio.get(),
        fontScale: PixelRatio.getFontScale(),
      });
    });

    return () => subscription?.remove();
  }, []);

  const { width, height, scale, fontScale } = dimensions;

  // Screen type detection
  const isSmallScreen = width < Breakpoints.small;
  const isMediumScreen =
    width >= Breakpoints.small && width < Breakpoints.large;
  const isLargeScreen =
    width >= Breakpoints.large && width < Breakpoints.tablet;
  const isTablet = width >= Breakpoints.tablet;
  const isLandscape = width > height;

  // Helper functions
  const wp = (percentage: number): number => {
    return (width * percentage) / 100;
  };

  const hp = (percentage: number): number => {
    return (height * percentage) / 100;
  };

  const sp = (spacing: number): number => {
    return getResponsiveSpacing(width, spacing);
  };

  const fs = (fontSize: number): number => {
    const responsiveSize = getResponsiveFontSize(width, fontSize);

    // Apply font scale from device settings
    return responsiveSize * fontScale;
  };

  // Layout calculations
  const headerHeight = isTablet ? 70 : 60;
  const contentHeight = height - headerHeight - (isTablet ? 100 : 80); // Account for tab bar

  // Grid and layout values
  const cardColumns = isTablet ? 3 : isLargeScreen ? 2 : 2;
  const gridSpacing = sp(12);
  const containerPadding = sp(16);

  // Responsive typography scale
  const typography = {
    xs: fs(12),
    sm: fs(14),
    md: fs(16),
    lg: fs(18),
    xl: fs(20),
    xxl: fs(24),
  };

  return {
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isTablet,
    isLandscape,
    screenWidth: width,
    screenHeight: height,
    pixelRatio: scale,
    fontScale,

    wp,
    hp,
    sp,
    fs,

    headerHeight,
    contentHeight,

    cardColumns,
    gridSpacing,
    containerPadding,

    typography,
  };
};

// Hook for responsive values based on screen size
export const useResponsiveValue = <T>(values: {
  small?: T;
  medium?: T;
  large?: T;
  tablet?: T;
  default: T;
}): T => {
  const { isSmallScreen, isMediumScreen, isLargeScreen, isTablet } =
    useResponsive();

  if (isTablet && values.tablet !== undefined) {
    return values.tablet;
  }

  if (isLargeScreen && values.large !== undefined) {
    return values.large;
  }

  if (isMediumScreen && values.medium !== undefined) {
    return values.medium;
  }

  if (isSmallScreen && values.small !== undefined) {
    return values.small;
  }

  return values.default;
};

// Hook for orientation-aware values
export const useOrientationValue = <T>(portrait: T, landscape: T): T => {
  const { isLandscape } = useResponsive();
  return isLandscape ? landscape : portrait;
};

// Hook for accessible touch targets
export const useAccessibleDimensions = () => {
  const { sp } = useResponsive();

  return {
    minTouchTarget: Math.max(44, sp(44)), // Minimum 44pt touch target
    buttonHeight: Math.max(48, sp(48)),
    inputHeight: Math.max(44, sp(44)),
    iconSize: {
      small: sp(16),
      medium: sp(20),
      large: sp(24),
      xlarge: sp(32),
    },
  };
};

// Hook for responsive margins and padding
export const useResponsiveSpacing = () => {
  const { sp } = useResponsive();

  return {
    xs: sp(4),
    sm: sp(8),
    md: sp(16),
    lg: sp(24),
    xl: sp(32),
    xxl: sp(40),

    // Semantic spacing
    containerPadding: sp(16),
    cardPadding: sp(16),
    sectionSpacing: sp(24),
    elementSpacing: sp(12),
  };
};

// Custom hook for responsive grid layouts
export const useResponsiveGrid = (itemMinWidth: number = 150) => {
  const { screenWidth, sp } = useResponsive();
  const containerPadding = sp(16);
  const itemSpacing = sp(12);

  const availableWidth = screenWidth - containerPadding * 2;
  const columnsCount = Math.floor(
    availableWidth / (itemMinWidth + itemSpacing),
  );
  const actualColumns = Math.max(1, Math.min(columnsCount, 4)); // Max 4 columns

  const itemWidth =
    (availableWidth - itemSpacing * (actualColumns - 1)) / actualColumns;

  return {
    columns: actualColumns,
    itemWidth,
    spacing: itemSpacing,
    containerPadding,
  };
};

export default useResponsive;
