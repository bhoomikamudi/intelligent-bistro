import { CartLineRow } from "../components/cart/CartLineRow";
import { EmptyState } from "../components/ui/EmptyState";
import { TabScreenWrapper } from "../components/TabScreenWrapper";
import { typography } from "../../constants/typography";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../lib/money";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";

const GOLD = "#C9A84C";
const BISTRO_DARK = "#080808";

export default function CartScreen() {
  const { lines, subtotal, tax, total, increment, decrement, removeItem } = useCart();
  const insets = useSafeAreaInsets();
  const isEmpty = lines.length === 0;

  return (
    <TabScreenWrapper>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🕯️</Text>
          <Text style={typography.screenTitle}>Your Order</Text>
          <Text style={styles.headerSub}>
            {isEmpty
              ? "Nothing selected yet."
              : `${lines.length} selection${lines.length === 1 ? "" : "s"}`}
          </Text>
        </View>

        {isEmpty ? (
          <EmptyState
            emoji="🛒"
            title="Your table is set"
            subtitle="Add something delicious from the menu or ask your concierge to curate your order."
            actionLabel="Browse Menu"
            actionHref="/"
          />
        ) : (
          <View style={styles.body}>
            <ScrollView
              style={styles.itemsScroll}
              contentContainerStyle={styles.itemsContent}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              bounces
            >
              {lines.map((line, i) => (
                <View key={line.item.id}>
                  {i > 0 && <View style={styles.separator} />}
                  <CartLineRow
                    line={line}
                    onDecrement={() => decrement(line.item.id)}
                    onIncrement={() => increment(line.item.id)}
                    onRemove={() => removeItem(line.item.id)}
                  />
                </View>
              ))}
            </ScrollView>

            <View style={[styles.summary, { paddingBottom: insets.bottom + 16 }]}>
              <View style={styles.summaryDivider} />
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
            </View>
          </View>
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
  headerEmoji: {
    fontSize: 22,
    marginBottom: 6,
  },
  headerSub: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    color: theme.textSecondary,
  },
  body: {
    flex: 1,
  },
  itemsScroll: {
    flex: 1,
  },
  itemsContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    flexGrow: 0,
  },
  separator: {
    height: 1,
    backgroundColor: theme.border,
  },
  summary: {
    backgroundColor: theme.bgCard,
    paddingTop: 4,
    paddingHorizontal: 16,
    marginTop: 0,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: GOLD,
    opacity: 0.45,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.text,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.text,
  },
  totalValue: {
    fontSize: 26,
    fontWeight: "800",
    color: GOLD,
  },
  checkout: {
    marginTop: 16,
    marginHorizontal: 0,
    marginBottom: 0,
    backgroundColor: GOLD,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: BISTRO_DARK,
  },
});
