import { FadeInUp } from "../animated/FadeInUp";
import { ScalePress } from "../animated/ScalePress";
import { QuantityButton } from "../QuantityButton";
import { useCart } from "../../../context/CartContext";
import { MenuItem } from "../../../data/menu";
import { formatPrice } from "../../../lib/money";
import { Text, View } from "react-native";

function ItemActions({ item }: { item: MenuItem }) {
  const { getQuantity, addItem, increment, decrement } = useCart();
  const quantity = getQuantity(item.id);

  if (quantity === 0) {
    return (
      <ScalePress
        onPress={() => addItem(item)}
        className="mt-4 self-start rounded-xl border border-bistro-accent/50 bg-bistro-accent/15 px-5 py-2.5"
        scaleTo={0.9}
      >
        <Text className="text-sm font-bold tracking-wide text-bistro-accent">Add to order</Text>
      </ScalePress>
    );
  }

  return (
    <View className="mt-4 flex-row items-center gap-2.5">
      <QuantityButton label="−" compact onPress={() => decrement(item.id)} />
      <Text className="min-w-[28px] text-center text-sm font-bold text-bistro-accent">{quantity}</Text>
      <QuantityButton label="+" compact onPress={() => increment(item.id)} />
    </View>
  );
}

export function MenuItemCard({ item, index }: { item: MenuItem; index: number }) {
  return (
    <FadeInUp index={index}>
      <View className="mb-4 overflow-hidden rounded-3xl border border-bistro-border/80 bg-bistro-card">
        <View className="p-5">
          <View className="flex-row gap-4">
            <View className="relative items-center justify-center rounded-2xl border border-bistro-accent/25 bg-bistro-accent/10 p-3 shadow-sm">
              <View
                className="absolute inset-0 rounded-2xl bg-bistro-accent/20"
                style={{
                  shadowColor: "#d4af37",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.35,
                  shadowRadius: 12,
                }}
              />
              <Text className="text-[42px] leading-none">{item.emoji}</Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-start justify-between gap-3">
                <Text className="flex-1 text-lg font-semibold leading-6 tracking-tight text-stone-50">
                  {item.name}
                </Text>
                <Text className="text-lg font-bold text-bistro-accent">{formatPrice(item.price)}</Text>
              </View>
              <Text className="mt-2 text-sm leading-[21px] text-stone-400">{item.description}</Text>
              <ItemActions item={item} />
            </View>
          </View>
        </View>
      </View>
    </FadeInUp>
  );
}
