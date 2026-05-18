import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

function GlowOrb({ size, style }: { size: number; style: object }) {
  const pulse = useSharedValue(0.35);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(0.65, { duration: 3200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.35, { duration: 3200, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "#d4af37",
        },
        style,
        animatedStyle,
      ]}
    />
  );
}

export function MenuHero() {
  return (
    <View className="overflow-hidden border-b border-bistro-border">
      <LinearGradient
        colors={["#1a1512", "#0c0a09", "#0f0d0b"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="relative px-6 pb-6 pt-4"
      >
        <GlowOrb size={120} style={{ top: -30, right: -20 }} />
        <GlowOrb size={80} style={{ bottom: 10, left: -25 }} />

        <Text className="text-[11px] font-semibold uppercase tracking-[0.35em] text-bistro-accent/90">
          Est. tonight
        </Text>
        <Text className="mt-2 text-[34px] font-bold leading-tight tracking-tight text-stone-50">
          Intelligent Bistro
        </Text>
        <Text className="mt-2 max-w-[280px] text-base leading-6 text-stone-400">
          Chef-driven plates, candlelit tables, and a concierge who knows your taste.
        </Text>
        <View className="mt-4 h-px w-20 bg-bistro-accent/60" />
      </LinearGradient>
    </View>
  );
}
