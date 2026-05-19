import { CartLine } from "../../../context/CartContext";
import { formatPrice } from "../../../lib/money";
import { Pressable, Text, View } from "react-native";

function GoldQtyButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="h-9 w-9 items-center justify-center rounded-lg border border-gold/60 bg-elevated">
      <Text className="text-xl font-semibold text-gold">{label}</Text>
    </Pressable>
  );
}

type CartLineRowProps = {
  line: CartLine;
  onDecrement: () => void;
  onIncrement: () => void;
  onRemove: () => void;
};

export function CartLineRow({ line, onDecrement, onIncrement, onRemove }: CartLineRowProps) {
  return (
    <View className="py-2">
      <View className="flex-row items-start gap-3.5">
        <View className="h-11 w-11 items-center justify-center rounded-full border border-gold/15 bg-elevated">
          <Text className="text-[24px] leading-7">{line.item.emoji}</Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-start justify-between gap-3">
            <Text className="flex-1 text-[17px] font-semibold leading-[22px] text-text-primary">{line.item.name}</Text>
            <Text className="text-base font-semibold text-gold">
              {formatPrice(line.item.price * line.quantity)}
            </Text>
          </View>
          <View className="mt-3 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3.5">
              <GoldQtyButton label="−" onPress={onDecrement} />
              <Text className="min-w-[28px] text-center text-base font-bold text-gold">{line.quantity}</Text>
              <GoldQtyButton label="+" onPress={onIncrement} />
            </View>
            <Pressable onPress={onRemove} hitSlop={8}>
              <Text className="text-[13px] text-muted">Remove</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
