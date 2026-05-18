import { Pressable, type PressableProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

type ScalePressProps = PressableProps & {
  children: React.ReactNode;
  className?: string;
  scaleTo?: number;
};

export function ScalePress({ children, className, scaleTo = 0.94, onPress, disabled, ...rest }: ScalePressProps) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(scaleTo, { damping: 14, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 280 });
      }}
      {...rest}
    >
      <Animated.View className={className} style={style}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
