import { Pressable, Text } from "react-native";

export function QuantityButton({
  label,
  onPress,
  compact,
}: {
  label: string;
  onPress: () => void;
  compact?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`items-center justify-center rounded-lg border border-bistro-border bg-stone-900 active:opacity-70 ${
        compact ? "h-8 w-8" : "h-9 w-9"
      }`}
    >
      <Text className={`font-semibold text-stone-200 ${compact ? "text-base" : "text-lg"}`}>{label}</Text>
    </Pressable>
  );
}
