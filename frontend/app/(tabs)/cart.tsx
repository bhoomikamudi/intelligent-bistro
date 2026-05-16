import { QuantityButton } from "@/components/QuantityButton";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/money";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartScreen() {
  const { lines, subtotal, tax, total, increment, decrement, removeItem } = useCart();
  const isEmpty = lines.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-bistro-bg" edges={["top"]}>
      <View className="border-b border-bistro-border px-5 pb-4 pt-2">
        <Text className="text-2xl font-bold text-stone-50">Cart</Text>
        <Text className="mt-1 text-sm text-stone-500">
          {isEmpty ? "Your table is waiting." : `${lines.length} dish${lines.length === 1 ? "" : "es"} selected`}
        </Text>
      </View>

      {isEmpty ? (
        <View className="flex-1 items-center justify-center px-10">
          <View className="mb-6 h-24 w-24 items-center justify-center rounded-full border border-bistro-border bg-bistro-card">
            <FontAwesome name="shopping-basket" size={40} color="#d4af37" />
          </View>
          <Text className="text-center text-xl font-semibold text-stone-100">Your cart is empty</Text>
          <Text className="mt-2 text-center text-base leading-6 text-stone-500">
            {"Browse tonight's menu and add dishes, or ask the concierge in Chat to build your order."}
          </Text>
          <Link href="/" asChild>
            <Pressable className="mt-8 rounded-xl border border-bistro-accent/40 bg-bistro-accent/10 px-6 py-3 active:opacity-80">
              <Text className="font-semibold text-bistro-accent">Browse menu</Text>
            </Pressable>
          </Link>
        </View>
      ) : (
        <>
          <ScrollView
            className="flex-1 px-4 pt-4"
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {lines.map((line) => (
              <View
                key={line.item.id}
                className="mb-3 rounded-2xl border border-bistro-border bg-bistro-card p-4"
              >
                <View className="flex-row gap-3">
                  <Text className="text-3xl">{line.item.emoji}</Text>
                  <View className="flex-1">
                    <View className="flex-row items-start justify-between gap-2">
                      <Text className="flex-1 text-base font-semibold text-stone-50">{line.item.name}</Text>
                      <Text className="text-base font-bold text-bistro-accent">
                        {formatPrice(line.item.price * line.quantity)}
                      </Text>
                    </View>
                    <Text className="mt-0.5 text-xs text-stone-500">
                      {formatPrice(line.item.price)} each
                    </Text>

                    <View className="mt-3 flex-row items-center justify-between">
                      <View className="flex-row items-center gap-2">
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
              </View>
            ))}
          </ScrollView>

          <SafeAreaView edges={["bottom"]} className="border-t border-bistro-border bg-bistro-card px-5 py-4">
            <View className="flex-row justify-between py-1">
              <Text className="text-sm text-stone-400">Subtotal</Text>
              <Text className="text-sm font-medium text-stone-200">{formatPrice(subtotal)}</Text>
            </View>
            <View className="flex-row justify-between py-1">
              <Text className="text-sm text-stone-400">Tax (8%)</Text>
              <Text className="text-sm font-medium text-stone-200">{formatPrice(tax)}</Text>
            </View>
            <View className="my-2 h-px bg-bistro-border" />
            <View className="mb-4 flex-row justify-between">
              <Text className="text-base font-semibold text-stone-50">Total</Text>
              <Text className="text-lg font-bold text-bistro-accent">{formatPrice(total)}</Text>
            </View>
            <Pressable className="items-center rounded-xl bg-bistro-accent py-4 active:opacity-90">
              <Text className="text-base font-bold tracking-wide text-stone-950">
                Checkout · {formatPrice(total)}
              </Text>
            </Pressable>
          </SafeAreaView>
        </>
      )}
    </SafeAreaView>
  );
}
