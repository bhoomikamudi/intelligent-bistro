import { TabScreenWrapper } from "../components/TabScreenWrapper";
import { theme } from "../../constants/theme";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../lib/money";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function GoldQtyButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="h-9 w-9 items-center justify-center rounded border border-gold">
      <Text className="text-xl font-semibold text-gold">{label}</Text>
    </Pressable>
  );
}

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
          <View className="flex-1 items-center justify-center px-10">
            <Text className="text-5xl">🛒</Text>
            <Text className="mt-5 text-center text-[22px] font-semibold text-text-primary">Your table is set</Text>
            <Text className="mt-2.5 text-center text-[15px] leading-[22px] text-muted">
              Add something delicious to get started
            </Text>
            <Link href="/" asChild>
              <Pressable className="mt-7 rounded-md border border-gold px-7 py-3 active:opacity-80">
                <Text className="text-sm font-semibold text-gold">Browse menu</Text>
              </Pressable>
            </Link>
          </View>
        ) : (
          <>
            <ScrollView
              className="flex-1"
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              {lines.map((line, i) => (
                <View key={line.item.id}>
                  {i > 0 && <View className="my-4 h-px bg-[#222222]" />}
                  <View className="py-1">
                    <View className="flex-row items-start gap-3">
                      <View style={styles.emojiCircle}>
                        <Text style={styles.emoji}>{line.item.emoji}</Text>
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-start justify-between gap-3">
                          <Text className="flex-1 text-[17px] font-semibold text-text-primary">{line.item.name}</Text>
                          <Text className="text-base font-semibold text-gold">
                            {formatPrice(line.item.price * line.quantity)}
                          </Text>
                        </View>
                        <View className="mt-3 flex-row items-center justify-between">
                          <View className="flex-row items-center gap-3.5">
                            <GoldQtyButton label="−" onPress={() => decrement(line.item.id)} />
                            <Text className="min-w-[28px] text-center text-base font-bold text-gold">
                              {line.quantity}
                            </Text>
                            <GoldQtyButton label="+" onPress={() => increment(line.item.id)} />
                          </View>
                          <Pressable onPress={() => removeItem(line.item.id)}>
                            <Text className="text-[13px] text-muted">Remove</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </View>
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
              <Pressable className="w-full items-center rounded-lg bg-gold py-4">
                <Text className="text-base font-bold tracking-wide text-bistro">Checkout</Text>
              </Pressable>
            </SafeAreaView>
          </>
        )}
      </SafeAreaView>
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  emojiCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 22,
    lineHeight: 26,
  },
});
