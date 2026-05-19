import { CartLineRow } from "../components/cart/CartLineRow";
import { EmptyState } from "../components/ui/EmptyState";
import { TabScreenWrapper } from "../components/TabScreenWrapper";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../lib/money";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartScreen() {
  const { lines, subtotal, tax, total, increment, decrement, removeItem } = useCart();
  const isEmpty = lines.length === 0;

  return (
    <TabScreenWrapper>
      <SafeAreaView className="flex-1 bg-bistro" edges={["top"]}>
        <View className="border-b border-[#222222] px-6 pb-5 pt-3">
          <Text className="text-[11px] font-semibold uppercase tracking-[3px] text-gold">Your table</Text>
          <Text className="mt-1.5 text-[30px] font-bold text-text-primary">Cart</Text>
          <Text className="mt-1.5 text-sm text-muted">
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
            actionLabel="Browse menu"
            actionHref="/"
          />
        ) : (
          <>
            <ScrollView
              className="flex-1 px-6"
              contentContainerStyle={{ paddingTop: 8, paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              {lines.map((line, i) => (
                <View key={line.item.id}>
                  {i > 0 && <View className="my-4 h-px bg-[#222222]" />}
                  <CartLineRow
                    line={line}
                    onDecrement={() => decrement(line.item.id)}
                    onIncrement={() => increment(line.item.id)}
                    onRemove={() => removeItem(line.item.id)}
                  />
                </View>
              ))}
            </ScrollView>

            <SafeAreaView edges={["bottom"]} className="border-t border-[#222222] bg-card px-6 pb-2 pt-[18px]">
              <View className="flex-row justify-between py-1.5">
                <Text className="text-sm text-muted">Subtotal</Text>
                <Text className="text-sm text-text-primary">{formatPrice(subtotal)}</Text>
              </View>
              <View className="flex-row justify-between py-1.5">
                <Text className="text-sm text-muted">Tax (8%)</Text>
                <Text className="text-sm text-text-primary">{formatPrice(tax)}</Text>
              </View>
              <View className="mb-[18px] mt-2 flex-row items-center justify-between border-t border-[#222222] pt-3">
                <Text className="text-[15px] font-bold text-text-primary">Total</Text>
                <Text className="text-[22px] font-bold text-gold">{formatPrice(total)}</Text>
              </View>
              <Pressable className="w-full items-center rounded-lg bg-gold py-4 active:opacity-90">
                <Text className="text-base font-bold tracking-wide text-bistro">Checkout</Text>
              </Pressable>
            </SafeAreaView>
          </>
        )}
      </SafeAreaView>
    </TabScreenWrapper>
  );
}
