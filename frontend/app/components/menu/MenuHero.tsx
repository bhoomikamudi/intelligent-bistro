import { LinearGradient } from "expo-linear-gradient";
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
    <View className="overflow-hidden border-b border-[#222222]">
      <LinearGradient
        colors={["#2a2218", "#14110e", "#080808"]}
        locations={[0, 0.45, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <LinearGradient
          colors={["rgba(201, 168, 76, 0.18)", "rgba(201, 168, 76, 0)", "transparent"]}
          locations={[0, 0.5, 1]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.glow}
          pointerEvents="none"
        />
        <Animated.View style={{ opacity, transform: [{ translateY }] }}>
          <Text className="text-[11px] font-semibold uppercase tracking-[4px] text-gold">Est. 2024</Text>
          <Text className="mt-2 text-[30px] uppercase tracking-[5px] text-text-primary" style={styles.serif}>
            Intelligent Bistro
          </Text>
          <Text className="mt-2.5 text-[15px] italic leading-[22px] text-muted">
            Where every plate tells a story
          </Text>
          <View className="mt-5 h-px w-20 bg-gold/70" />
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
  },
  glow: {
    position: "absolute",
    top: -48,
    right: -48,
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  serif: {
    fontFamily: "Georgia",
  },
});
