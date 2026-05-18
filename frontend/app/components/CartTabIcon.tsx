import { theme } from "../../constants/theme";
import { useCart } from "../../context/CartContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, Text, View } from "react-native";

export function CartTabIcon({ color }: { color: string }) {
  const { itemCount } = useCart();

  return (
    <View style={styles.wrap}>
      <FontAwesome name="shopping-cart" size={22} color={color} style={styles.icon} />
      {itemCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{itemCount > 99 ? "99+" : itemCount}</Text>
        </View>
      )}
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
  icon: {
    marginBottom: -2,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -4,
    minWidth: 16,
    minHeight: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: theme.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: theme.bg,
  },
});
