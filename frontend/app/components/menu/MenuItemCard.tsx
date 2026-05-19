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
          <View style={styles.topRow}>
            <View style={styles.emojiCircle}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <View style={styles.titleBlock}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>{formatPrice(item.price)}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
            {item.description}
          </Text>
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
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 18,
    paddingLeft: 16,
  },
  topRow: {
    flexDirection: "row",
    gap: 14,
  },
  emojiCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.bgElevated,
    borderWidth: 1,
    borderColor: "rgba(201, 168, 76, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 28,
    lineHeight: 32,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
    color: theme.text,
  },
  price: {
    fontSize: 17,
    fontWeight: "700",
    color: GOLD,
  },
  description: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 21,
    color: theme.textSecondary,
  },
  addButton: {
    alignSelf: "flex-start",
    marginTop: 0,
    paddingVertical: 8,
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
  qtyRow: {
    marginTop: 0,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 14,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(201, 168, 76, 0.55)",
    backgroundColor: theme.bgElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: "600",
    color: GOLD,
  },
  qtyValue: {
    minWidth: 28,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: GOLD,
  },
});
