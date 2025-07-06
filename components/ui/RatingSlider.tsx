import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanGestureHandler,
  GestureHandlerRootView,
} from "react-native";
import { PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

interface RatingSliderProps {
  label?: string;
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
}

export default function RatingSlider({
  label = "Minimum Rating",
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 5,
  step = 0.1,
}: RatingSliderProps) {
  const [sliderWidth, setSliderWidth] = useState(300);
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    const position =
      ((value - minimumValue) / (maximumValue - minimumValue)) * sliderWidth;
    translateX.value = Math.max(0, Math.min(position, sliderWidth));
  }, [value, sliderWidth, minimumValue, maximumValue]);

  const gestureHandler =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
      onStart: (_, context) => {
        context.startX = translateX.value;
      },
      onActive: (event, context) => {
        const newX = Math.max(
          0,
          Math.min(context.startX + event.translationX, sliderWidth),
        );
        translateX.value = newX;

        const newValue = interpolate(
          newX,
          [0, sliderWidth],
          [minimumValue, maximumValue],
          Extrapolate.CLAMP,
        );

        const steppedValue = Math.round(newValue / step) * step;
        runOnJS(onValueChange)(
          Math.max(minimumValue, Math.min(steppedValue, maximumValue)),
        );
      },
    });

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value - 12 }],
    };
  });

  const trackStyle = useAnimatedStyle(() => {
    return {
      width: translateX.value,
    };
  });

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = "⭐".repeat(fullStars);
    if (hasHalfStar) stars += "✨";
    return stars || "☆";
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>{value.toFixed(1)}</Text>
          <Text style={styles.starsText}>{getRatingStars(value)}</Text>
        </View>
      </View>

      <View
        style={styles.sliderContainer}
        onLayout={(event) => {
          setSliderWidth(event.nativeEvent.layout.width - 24);
        }}
      >
        <View style={styles.track}>
          <Animated.View style={[styles.activeTrack, trackStyle]} />
        </View>

        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.thumb, thumbStyle]}>
            <View style={styles.thumbInner} />
          </Animated.View>
        </PanGestureHandler>
      </View>

      <View style={styles.rangeLabels}>
        <Text style={styles.rangeLabel}>{minimumValue.toFixed(1)}</Text>
        <Text style={styles.rangeLabel}>{maximumValue.toFixed(1)}</Text>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  valueText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginRight: 8,
  },
  starsText: {
    fontSize: 14,
  },
  sliderContainer: {
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  track: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
  },
  activeTrack: {
    height: 4,
    backgroundColor: "#1D4ED8",
    borderRadius: 2,
  },
  thumb: {
    position: "absolute",
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#1D4ED8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 12,
  },
  rangeLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
});
