import { useCart } from "@/context/CartContext";
import { menuCategories } from "@/data/menu";
import { formatPrice } from "@/lib/money";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MenuScreen() {
  const { addItem } = useCart();

  return (
    <SafeAreaView className="flex-1 bg-bistro-bg" edges={["top"]}>
      <View className="border-b border-bistro-border px-5 pb-4 pt-2">
        <Text className="text-xs font-semibold uppercase tracking-[0.25em] text-bistro-accent">
          Intelligent Bistro
        </Text>
        <Text className="mt-1 text-3xl font-bold tracking-tight text-stone-50">{"Tonight's menu"}</Text>
        <View className="mt-3 h-px w-16 bg-bistro-accent" />
      </View>
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {menuCategories.map((cat) => (
          <View key={cat.id} className="mb-8">
            <Text className="mb-3 px-1 text-lg font-semibold text-stone-100">{cat.title}</Text>
            {cat.items.map((item) => (
              <View
                key={item.id}
                className="mb-3 overflow-hidden rounded-2xl border border-bistro-border bg-bistro-card p-4"
              >
                <View className="flex-row gap-3">
                  <Text className="text-4xl">{item.emoji}</Text>
                  <View className="flex-1">
                    <View className="flex-row items-start justify-between gap-2">
                      <Text className="flex-1 text-base font-semibold text-stone-50">{item.name}</Text>
                      <Text className="text-base font-bold text-bistro-accent">{formatPrice(item.price)}</Text>
                    </View>
                    <Text className="mt-1.5 text-sm leading-5 text-stone-400">{item.description}</Text>
                    <Pressable
                      onPress={() => addItem(item)}
                      className="mt-3 self-start rounded-lg border border-bistro-accent/40 bg-bistro-accent/10 px-4 py-2 active:opacity-70"
                    >
                      <Text className="text-sm font-semibold text-bistro-accent">Add</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
