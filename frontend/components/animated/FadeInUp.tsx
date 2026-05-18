import Animated, { FadeInUp as ReanimatedFadeInUp } from "react-native-reanimated";

type FadeInUpProps = {
  index: number;
  children: React.ReactNode;
  className?: string;
};

export function FadeInUp({ index, children, className }: FadeInUpProps) {
  return (
    <Animated.View
      entering={ReanimatedFadeInUp.delay(index * 50)
        .duration(450)
        .springify()
        .damping(22)
        .stiffness(140)}
      className={className}
    >
      {children}
    </Animated.View>
  );
}
