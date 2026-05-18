import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

export function MenuHero() {
  const translateY = useRef(new Animated.Value(-40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <View className="border-b border-[#222222] bg-bistro px-6 pb-6 pt-5">
      <Animated.View style={{ opacity, transform: [{ translateY }] }}>
        <Text className="text-[32px] uppercase tracking-[6px] text-text-primary" style={styles.serif}>
          INTELLIGENT BISTRO
        </Text>
        <Text className="mt-2.5 text-sm italic text-muted">Where every plate tells a story</Text>
        <View className="mt-[18px] h-px w-[72px] bg-gold" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  serif: {
    fontFamily: "Georgia",
  },
});
