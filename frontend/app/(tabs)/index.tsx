import { QuantityButton } from "@/components/QuantityButton";
import { useCart } from "@/context/CartContext";
import { MenuItem, menuCategories } from "@/data/menu";
import { formatPrice } from "@/lib/money";
import { useRef, useState } from "react";
import { LayoutChangeEvent, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function MenuItemActions({ item }: { item: MenuItem }) {
  const { getQuantity, addItem, increment, decrement } = useCart();
  const quantity = getQuantity(item.id);

  if (quantity === 0) {
    return (
      <Pressable
        onPress={() => addItem(item)}
        className="mt-3 self-start rounded-lg border border-bistro-accent/40 bg-bistro-accent/10 px-4 py-2 active:opacity-70"
      >
        <Text className="text-sm font-semibold text-bistro-accent">Add</Text>
      </Pressable>
    );
  }

  return (
    <View className="mt-3 flex-row items-center gap-2">
      <QuantityButton label="−" compact onPress={() => decrement(item.id)} />
      <Text className="min-w-[24px] text-center text-sm font-bold text-bistro-accent">{quantity}</Text>
      <QuantityButton label="+" compact onPress={() => increment(item.id)} />
    </View>
  );
}

export default function MenuScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState(menuCategories[0]?.id ?? "");

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const y = sectionOffsets.current[categoryId];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 8), animated: true });
    }
  };

  const onSectionLayout = (categoryId: string) => (e: LayoutChangeEvent) => {
    sectionOffsets.current[categoryId] = e.nativeEvent.layout.y;
  };

  return (
    <SafeAreaView className="flex-1 bg-bistro-bg" edges={["top"]}>
      <View className="border-b border-bistro-border px-5 pb-3 pt-2">
        <Text className="text-xs font-semibold uppercase tracking-[0.25em] text-bistro-accent">
          Intelligent Bistro
        </Text>
        <Text className="mt-1 text-3xl font-bold tracking-tight text-stone-50">{"Tonight's menu"}</Text>
        <View className="mt-3 h-px w-16 bg-bistro-accent" />
      </View>

      <View className="border-b border-bistro-border bg-bistro-bg">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: "row",
            gap: 8,
          }}
          className="flex-grow-0"
        >
          {menuCategories.map((cat) => {
            const selected = activeCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => scrollToCategory(cat.id)}
                className={`rounded-full border px-4 py-2 active:opacity-80 ${
                  selected
                    ? "border-bistro-accent bg-bistro-accent"
                    : "border-bistro-border bg-bistro-card"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${selected ? "text-stone-950" : "text-stone-300"}`}
                >
                  {cat.title}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        ref={scrollRef}
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {menuCategories.map((cat) => (
          <View key={cat.id} onLayout={onSectionLayout(cat.id)} className="mb-8">
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
                    <MenuItemActions item={item} />
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
