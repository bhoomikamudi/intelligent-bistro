import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export function TabScreenWrapper({ children }: { children: React.ReactNode }) {
  const focused = useIsFocused();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(focused ? 1 : 0.96, { duration: 240 });
  }, [focused, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value, flex: 1 }));

  return (
    <Animated.View style={style} className="flex-1 bg-bistro-bg">
      {children}
    </Animated.View>
  );
}
