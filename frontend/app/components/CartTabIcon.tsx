import { useCart } from "../../context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

const GOLD = "#C9A84C";
const MUTED = "#8A8070";

export function CartTabIcon({ focused }: { focused: boolean }) {
  const { itemCount } = useCart();
  const color = focused ? GOLD : MUTED;

  return (
    <View style={styles.wrap}>
      <Ionicons name={focused ? "cart" : "cart-outline"} size={24} color={color} />
      {itemCount > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{itemCount > 99 ? "99+" : itemCount}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    width: 32,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -6,
    minWidth: 16,
    minHeight: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
