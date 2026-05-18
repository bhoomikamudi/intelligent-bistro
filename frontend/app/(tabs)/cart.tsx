import { TabScreenWrapper } from "../components/TabScreenWrapper";
import { theme } from "../../constants/theme";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../lib/money";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function GoldQtyButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.qtyBtn}>
      <Text style={styles.qtyBtnText}>{label}</Text>
    </Pressable>
  );
}

export default function CartScreen() {
  const { lines, subtotal, tax, total, increment, decrement, removeItem } = useCart();
  const isEmpty = lines.length === 0;

  return (
    <TabScreenWrapper>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>Your table</Text>
          <Text style={styles.headerTitle}>Cart</Text>
          <Text style={styles.headerSub}>
            {isEmpty
              ? "Nothing selected yet."
              : `${lines.length} selection${lines.length === 1 ? "" : "s"}`}
          </Text>
        </View>

        {isEmpty ? (
          <View style={styles.empty}>
            <FontAwesome name="shopping-basket" size={48} color={theme.goldDim} />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyBody}>Browse the menu or ask the concierge to curate your table.</Text>
            <Link href="/" asChild>
              <Pressable style={styles.emptyBtn}>
                <Text style={styles.emptyBtnText}>View menu</Text>
              </Pressable>
            </Link>
          </View>
        ) : (
          <>
            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            >
              {lines.map((line, i) => (
                <View key={line.item.id}>
                  {i > 0 && <View style={styles.divider} />}
                  <View style={styles.line}>
                    <View style={styles.lineTop}>
                      <Text style={styles.lineName}>{line.item.name}</Text>
                      <Text style={styles.linePrice}>
                        {formatPrice(line.item.price * line.quantity)}
                      </Text>
                    </View>
                    <View style={styles.lineControls}>
                      <View style={styles.qtyRow}>
                        <GoldQtyButton label="−" onPress={() => decrement(line.item.id)} />
                        <Text style={styles.qtyNum}>{line.quantity}</Text>
                        <GoldQtyButton label="+" onPress={() => increment(line.item.id)} />
                      </View>
                      <Pressable onPress={() => removeItem(line.item.id)}>
                        <Text style={styles.remove}>Remove</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <SafeAreaView edges={["bottom"]} style={styles.footer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax (8%)</Text>
                <Text style={styles.summaryValue}>{formatPrice(tax)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatPrice(total)}</Text>
              </View>
              <Pressable style={styles.checkout}>
                <Text style={styles.checkoutText}>Checkout</Text>
              </Pressable>
            </SafeAreaView>
          </>
        )}
      </SafeAreaView>
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.border,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 3,
    textTransform: "uppercase",
    color: theme.gold,
  },
  headerTitle: {
    marginTop: 6,
    fontSize: 30,
    fontWeight: "700",
    color: theme.text,
  },
  headerSub: {
    marginTop: 6,
    fontSize: 14,
    color: theme.textSecondary,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "600",
    color: theme.text,
  },
  emptyBody: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: theme.textSecondary,
  },
  emptyBtn: {
    marginTop: 28,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: theme.gold,
    borderRadius: 6,
  },
  emptyBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.gold,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.border,
    marginVertical: 16,
  },
  line: {
    paddingVertical: 4,
  },
  lineTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  lineName: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    color: theme.text,
  },
  linePrice: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.gold,
  },
  lineControls: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: theme.gold,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.gold,
  },
  qtyNum: {
    minWidth: 28,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: theme.gold,
  },
  remove: {
    fontSize: 13,
    color: theme.textMuted,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.border,
    backgroundColor: theme.bgCard,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: theme.text,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 18,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.border,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.text,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.gold,
  },
  checkout: {
    width: "100%",
    backgroundColor: theme.gold,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: theme.bg,
  },
});
