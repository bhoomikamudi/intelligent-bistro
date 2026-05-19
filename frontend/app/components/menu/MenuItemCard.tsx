import { useCart } from "../../../context/CartContext";
import { MenuItem } from "../../../data/menu";
import { formatPrice } from "../../../lib/money";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../../../constants/theme";

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
  opacity,
}: {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
  opacity: Animated.Value;
}) {
  return (
    <Animated.View style={[styles.qtyRow, { opacity }]}>
      <Pressable onPress={onDecrement} style={styles.qtyBtn}>
        <Text style={styles.qtyBtnText}>−</Text>
      </Pressable>
      <Text style={styles.qtyValue}>{quantity}</Text>
      <Pressable onPress={onIncrement} style={styles.qtyBtn}>
        <Text style={styles.qtyBtnText}>+</Text>
      </Pressable>
    </Animated.View>
  );
}

export function MenuItemCard({
  item,
  index,
  isLast,
}: {
  item: MenuItem;
  index: number;
  isLast?: boolean;
}) {
  const { getQuantity, addItem, increment, decrement } = useCart();
  const quantity = getQuantity(item.id);
  const fadeIn = useRef(new Animated.Value(0)).current;
  const controlsOpacity = useRef(new Animated.Value(quantity > 0 ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 450,
      delay: index * 80,
      useNativeDriver: true,
    }).start();
  }, [index, fadeIn]);

  useEffect(() => {
    Animated.timing(controlsOpacity, {
      toValue: quantity > 0 ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [quantity, controlsOpacity]);

  return (
    <Animated.View style={{ opacity: fadeIn }}>
      <View style={[styles.card, !isLast && styles.cardBorder]}>
        <View style={styles.goldBorder} />
        <View style={styles.cardInner}>
          <View style={styles.mainRow}>
            <View style={styles.emojiCircle}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <View style={styles.leftCol}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
                {item.description}
              </Text>
            </View>
            <View style={styles.rightCol}>
              <Text style={styles.price}>{formatPrice(item.price)}</Text>
              {quantity === 0 ? (
                <AddButton onPress={() => addItem(item)} />
              ) : (
                <QuantityControls
                  quantity={quantity}
                  onDecrement={() => decrement(item.id)}
                  onIncrement={() => increment(item.id)}
                  opacity={controlsOpacity}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: theme.bgCard,
    overflow: "hidden",
  },
  cardBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  goldBorder: {
    width: 3,
    backgroundColor: GOLD,
  },
  cardInner: {
    flex: 1,
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 16,
    paddingLeft: 14,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  emojiCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.bgElevated,
    borderWidth: 1,
    borderColor: "rgba(201, 168, 76, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 26,
    lineHeight: 30,
  },
  leftCol: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 22,
    color: theme.text,
  },
  description: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: theme.textSecondary,
  },
  rightCol: {
    alignItems: "flex-end",
    flexShrink: 0,
  },
  price: {
    fontSize: 17,
    fontWeight: "700",
    color: GOLD,
  },
  addButton: {
    marginTop: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: GOLD,
  },
  addButtonText: {
    color: BISTRO_DARK,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  qtyRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(201, 168, 76, 0.55)",
    backgroundColor: theme.bgElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: GOLD,
  },
  qtyValue: {
    minWidth: 22,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    color: GOLD,
  },
});
