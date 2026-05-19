import { useCart } from "../../../context/CartContext";
import { MenuItem } from "../../../data/menu";
import { formatPrice } from "../../../lib/money";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

const GOLD = "#C9A84C";
const BISTRO_DARK = "#080808";

function AddButton({ onPress }: { onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => Animated.timing(scale, { toValue: 0.97, duration: 100, useNativeDriver: true }).start()}
      onPressOut={() => Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }).start()}
    >
      <Animated.View style={[styles.addButton, { transform: [{ scale }] }]}>
        <Text style={styles.addButtonText}>Add to order</Text>
      </Animated.View>
    </Pressable>
  );
}

function QuantityControls({
  quantity,
  onDecrement,
  onIncrement,
}: {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <View className="mt-4 w-full flex-row items-center justify-center gap-4">
      <Pressable
        onPress={onDecrement}
        className="h-10 w-10 items-center justify-center rounded-lg border border-gold/60 bg-elevated"
      >
        <Text className="text-lg font-semibold text-gold">−</Text>
      </Pressable>
      <Text className="min-w-[32px] text-center text-base font-bold text-gold">{quantity}</Text>
      <Pressable
        onPress={onIncrement}
        className="h-10 w-10 items-center justify-center rounded-lg border border-gold/60 bg-elevated"
      >
        <Text className="text-lg font-semibold text-gold">+</Text>
      </Pressable>
    </View>
  );
}

export function MenuItemCard({ item, index }: { item: MenuItem; index: number }) {
  const { getQuantity, addItem, increment, decrement } = useCart();
  const quantity = getQuantity(item.id);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 450,
      delay: index * 80,
      useNativeDriver: true,
    }).start();
  }, [index, opacity]);

  return (
    <Animated.View style={{ opacity }} className="mb-4">
      <View className="rounded-2xl border border-[#222222] bg-card p-5">
        <View className="flex-row gap-4">
          <View className="h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-gold/20 bg-elevated">
            <Text className="text-[28px] leading-8">{item.emoji}</Text>
          </View>
          <View className="min-w-0 flex-1">
            <View className="flex-row items-start justify-between gap-3">
              <Text className="flex-1 text-lg font-bold leading-6 text-text-primary">{item.name}</Text>
              <Text className="shrink-0 text-lg font-bold text-gold">{formatPrice(item.price)}</Text>
            </View>
          </View>
        </View>
        <Text className="mt-3 text-[14px] leading-[21px] text-muted">{item.description}</Text>
        {quantity === 0 ? (
          <AddButton onPress={() => addItem(item)} />
        ) : (
          <QuantityControls
            quantity={quantity}
            onDecrement={() => decrement(item.id)}
            onIncrement={() => increment(item.id)}
          />
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: GOLD,
  },
  addButtonText: {
    color: BISTRO_DARK,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
