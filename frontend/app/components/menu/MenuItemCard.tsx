import { theme } from "../../../constants/theme";
import { useCart } from "../../../context/CartContext";
import { MenuItem } from "../../../data/menu";
import { formatPrice } from "../../../lib/money";
import { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

function AddButton({ onPress }: { onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.timing(scale, { toValue: 0.92, duration: 100, useNativeDriver: true }).start();
  };

  const pressOut = () => {
    Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
      <Animated.View style={[styles.addButton, { transform: [{ scale }] }]}>
        <Text style={styles.addButtonText}>Add</Text>
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
    <View style={styles.quantityRow}>
      <Pressable onPress={onDecrement} style={styles.qtyBtn}>
        <Text style={styles.qtyBtnText}>−</Text>
      </Pressable>
      <Text style={styles.qtyValue}>{quantity}</Text>
      <Pressable onPress={onIncrement} style={styles.qtyBtn}>
        <Text style={styles.qtyBtnText}>+</Text>
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
    <Animated.View style={[styles.cardWrap, { opacity }]}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.emoji}>{item.emoji}</Text>
          <View style={styles.body}>
            <View style={styles.titleRow}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{formatPrice(item.price)}</Text>
            </View>
            <Text style={styles.description}>{item.description}</Text>
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
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrap: {
    marginBottom: 14,
  },
  card: {
    backgroundColor: theme.bgCard,
    borderLeftWidth: 3,
    borderLeftColor: theme.gold,
    borderRadius: 4,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    gap: 14,
  },
  emoji: {
    fontSize: 28,
    lineHeight: 34,
  },
  body: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: theme.text,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.gold,
  },
  description: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: theme.textSecondary,
  },
  addButton: {
    marginTop: 14,
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.gold,
    borderRadius: 4,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.gold,
    letterSpacing: 0.5,
  },
  quantityRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: theme.gold,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.gold,
  },
  qtyValue: {
    minWidth: 24,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    color: theme.gold,
  },
});
