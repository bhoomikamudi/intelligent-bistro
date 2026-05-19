import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { serif } from "../../../constants/typography";
import { theme } from "../../../constants/theme";

function GrainOverlay() {
  return (
    <View style={styles.grainWrap} pointerEvents="none">
      {Array.from({ length: 12 }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.grainLine,
            {
              top: (i * 14) % 160,
              opacity: 0.04 + (i % 3) * 0.015,
              transform: [{ rotate: `${-12 + (i % 4) * 8}deg` }],
            },
          ]}
        />
      ))}
      <View style={styles.grainDots} />
    </View>
  );
}

export function MenuHero() {
  const translateY = useRef(new Animated.Value(-40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 700, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={["#2a2218", "#14110e", "#080808"]}
        locations={[0, 0.45, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <LinearGradient
          colors={["rgba(201, 168, 76, 0.14)", "transparent"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0.2, y: 1 }}
          style={styles.glow}
          pointerEvents="none"
        />
        <GrainOverlay />
        <Animated.View style={{ opacity, transform: [{ translateY }] }}>
          <View style={styles.goldRule} />
          <Text style={styles.est}>Est. 2024</Text>
          <Text style={styles.title}>INTELLIGENT BISTRO</Text>
          <Text style={styles.tagline}>Where every plate tells a story</Text>
          <View style={styles.accentLine} />
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.border,
  },
  gradient: {
    minHeight: 180,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    justifyContent: "flex-end",
  },
  glow: {
    position: "absolute",
    top: -40,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  grainWrap: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  grainLine: {
    position: "absolute",
    left: -40,
    right: -40,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  grainDots: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.025)",
  },
  goldRule: {
    width: 48,
    height: 1,
    backgroundColor: theme.gold,
    marginBottom: 14,
    opacity: 0.85,
  },
  est: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 4,
    textTransform: "uppercase",
    color: theme.gold,
  },
  title: {
    marginTop: 10,
    fontFamily: serif,
    fontSize: 36,
    letterSpacing: 5,
    textTransform: "uppercase",
    color: theme.text,
  },
  tagline: {
    marginTop: 10,
    fontSize: 15,
    fontStyle: "italic",
    lineHeight: 22.5,
    color: theme.textSecondary,
  },
  accentLine: {
    marginTop: 20,
    height: 1,
    width: 72,
    backgroundColor: "rgba(201, 168, 76, 0.65)",
  },
});
