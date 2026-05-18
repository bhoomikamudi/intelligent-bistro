import { theme } from "../../../constants/theme";
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
    <View style={styles.container}>
      <Animated.View style={{ opacity, transform: [{ translateY }] }}>
        <Text style={styles.title}>INTELLIGENT BISTRO</Text>
        <Text style={styles.tagline}>Where every plate tells a story</Text>
        <View style={styles.rule} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.bg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.border,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontFamily: "Georgia",
    fontSize: 32,
    letterSpacing: 6,
    color: theme.text,
    textTransform: "uppercase",
  },
  tagline: {
    marginTop: 10,
    fontSize: 14,
    fontStyle: "italic",
    color: theme.textMuted,
  },
  rule: {
    marginTop: 18,
    height: 1,
    width: 72,
    backgroundColor: theme.gold,
  },
});
