import { FadeInUp } from "../../components/animated/FadeInUp";
import { CheckoutButton } from "../../components/cart/CheckoutButton";
import { QuantityButton } from "../../components/QuantityButton";
import { TabScreenWrapper } from "../../components/TabScreenWrapper";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../lib/money";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartScreen() {
  const { lines, subtotal, tax, total, increment, decrement, removeItem } = useCart();
  const isEmpty = lines.length === 0;

  return (
    <TabScreenWrapper>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <View className="border-b border-bistro-border px-6 pb-5 pt-3">
          <Text className="text-[11px] font-semibold uppercase tracking-[0.28em] text-bistro-accent">
            Your table
          </Text>
          <Text className="mt-1 text-3xl font-bold tracking-tight text-stone-50">Cart</Text>
          <Text className="mt-2 text-sm text-stone-500">
            {isEmpty
              ? "Nothing selected yet — the kitchen is ready when you are."
              : `${lines.length} selection${lines.length === 1 ? "" : "s"} · service included`}
          </Text>
        </View>

        {isEmpty ? (
          <FadeInUp index={0} className="flex-1">
            <View className="flex-1 items-center justify-center px-12">
              <View
                className="mb-8 h-28 w-28 items-center justify-center rounded-full border border-bistro-accent/30 bg-bistro-card"
                style={{
                  shadowColor: "#d4af37",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.2,
                  shadowRadius: 20,
                }}
              >
                <FontAwesome name="shopping-basket" size={44} color="#d4af37" />
              </View>
              <Text className="text-center text-2xl font-semibold tracking-tight text-stone-100">
                Your cart is empty
              </Text>
              <Text className="mt-3 text-center text-base leading-7 text-stone-500">
                Explore the menu or ask our concierge to curate something memorable for your table.
              </Text>
              <Link href="/" asChild>
                <Pressable className="mt-10 rounded-2xl border border-bistro-accent/40 bg-bistro-accent/10 px-8 py-3.5 active:opacity-85">
                  <Text className="font-semibold text-bistro-accent">View menu</Text>
                </Pressable>
              </Link>
            </View>
          </FadeInUp>
        ) : (
          <>
            <ScrollView
              className="flex-1 px-5 pt-5"
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            >
              {lines.map((line, index) => (
                <Animated.View
                  key={line.item.id}
                  entering={FadeInDown.delay(index * 40)
                    .duration(380)
                    .springify()
                    .damping(20)}
                  className="mb-4 overflow-hidden rounded-3xl border border-bistro-border/80 bg-bistro-card p-5"
                >
                  <View className="flex-row gap-4">
                    <View className="rounded-xl border border-bistro-accent/20 bg-bistro-accent/10 p-2.5">
                      <Text className="text-3xl">{line.item.emoji}</Text>
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-start justify-between gap-2">
                        <Text className="flex-1 text-lg font-semibold text-stone-50">{line.item.name}</Text>
                        <Text className="text-lg font-bold text-bistro-accent">
                          {formatPrice(line.item.price * line.quantity)}
                        </Text>
                      </View>
                      <Text className="mt-1 text-xs text-stone-500">
                        {formatPrice(line.item.price)} each
                      </Text>

                      <View className="mt-4 flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2.5">
                          <QuantityButton label="−" onPress={() => decrement(line.item.id)} />
                          <Text className="min-w-[28px] text-center text-base font-semibold text-stone-100">
                            {line.quantity}
                          </Text>
                          <QuantityButton label="+" onPress={() => increment(line.item.id)} />
                        </View>

                        <Pressable
                          onPress={() => removeItem(line.item.id)}
                          className="flex-row items-center gap-1.5 rounded-lg px-2 py-1.5 active:opacity-70"
                        >
                          <FontAwesome name="trash-o" size={16} color="#a8a29e" />
                          <Text className="text-sm font-medium text-stone-400">Remove</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </ScrollView>

            <SafeAreaView
              edges={["bottom"]}
              className="border-t border-bistro-border bg-stone-950/90 px-6 pb-2 pt-5"
            >
              <View className="mb-1 flex-row justify-between py-1.5">
                <Text className="text-sm text-stone-500">Subtotal</Text>
                <Text className="text-sm font-medium text-stone-300">{formatPrice(subtotal)}</Text>
              </View>
              <View className="flex-row justify-between py-1.5">
                <Text className="text-sm text-stone-500">Tax (8%)</Text>
                <Text className="text-sm font-medium text-stone-300">{formatPrice(tax)}</Text>
              </View>
              <View className="my-3 h-px bg-bistro-border" />
              <View className="mb-5 flex-row items-end justify-between">
                <Text className="text-sm font-medium uppercase tracking-wider text-stone-500">Total</Text>
                <Text className="text-2xl font-bold text-bistro-accent">{formatPrice(total)}</Text>
              </View>
              <CheckoutButton total={total} />
            </SafeAreaView>
          </>
        )}
      </SafeAreaView>
    </TabScreenWrapper>
  );
}
