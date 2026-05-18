import { useIsFocused } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

export function TabScreenWrapper({ children }: { children: React.ReactNode }) {
  const focused = useIsFocused();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: focused ? 1 : 0.97,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [focused, opacity]);

  return (
    <Animated.View className="flex-1 bg-bistro" style={[styles.wrap, { opacity }]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
});
