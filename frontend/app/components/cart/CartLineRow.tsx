import { CartLine } from "../../../context/CartContext";
import { formatPrice } from "../../../lib/money";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../../../constants/theme";

const GOLD = "#C9A84C";

function GoldQtyButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.qtyBtn}>
      <Text style={styles.qtyBtnText}>{label}</Text>
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
    <View style={styles.row}>
      <View style={styles.emojiCircle}>
        <Text style={styles.emoji}>{line.item.emoji}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{line.item.name}</Text>
          <Text style={styles.linePrice}>{formatPrice(line.item.price * line.quantity)}</Text>
        </View>
        <View style={styles.controls}>
          <View style={styles.qtyGroup}>
            <GoldQtyButton label="−" onPress={onDecrement} />
            <Text style={styles.qtyValue}>{line.quantity}</Text>
            <GoldQtyButton label="+" onPress={onIncrement} />
          </View>
          <Pressable onPress={onRemove} hitSlop={8}>
            <Text style={styles.remove}>Remove</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingVertical: 16,
    gap: 14,
  },
  emojiCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.bgElevated,
    borderWidth: 1,
    borderColor: "rgba(201, 168, 76, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 24,
    lineHeight: 28,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 22,
    color: theme.text,
  },
  linePrice: {
    fontSize: 16,
    fontWeight: "700",
    color: GOLD,
  },
  controls: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  qtyGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
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
  remove: {
    fontSize: 13,
    color: theme.textSecondary,
  },
});
