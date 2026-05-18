import { MenuHero } from "../../components/menu/MenuHero";
import { MenuItemCard } from "../../components/menu/MenuItemCard";
import { TabScreenWrapper } from "../../components/TabScreenWrapper";
import { menuCategories } from "../../data/menu";
import { useRef, useState } from "react";
import { LayoutChangeEvent, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MenuScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState(menuCategories[0]?.id ?? "");

  let itemIndex = 0;

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const y = sectionOffsets.current[categoryId];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 12), animated: true });
    }
  };

  const onSectionLayout = (categoryId: string) => (e: LayoutChangeEvent) => {
    sectionOffsets.current[categoryId] = e.nativeEvent.layout.y;
  };

  return (
    <TabScreenWrapper>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <MenuHero />

        <View className="border-b border-bistro-border/80 bg-bistro-bg/95">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingVertical: 14,
              flexDirection: "row",
              gap: 10,
            }}
          >
            {menuCategories.map((cat) => {
              const selected = activeCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => scrollToCategory(cat.id)}
                  className={`rounded-full border px-5 py-2.5 active:opacity-85 ${
                    selected
                      ? "border-bistro-accent bg-bistro-accent"
                      : "border-bistro-border bg-bistro-card"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold tracking-wide ${
                      selected ? "text-stone-950" : "text-stone-300"
                    }`}
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
          className="flex-1 px-5 pt-6"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {menuCategories.map((cat) => (
            <View key={cat.id} onLayout={onSectionLayout(cat.id)} className="mb-10">
              <Text className="mb-5 px-0.5 text-xs font-semibold uppercase tracking-[0.22em] text-bistro-accent">
                {cat.title}
              </Text>
              {cat.items.map((item) => {
                const index = itemIndex++;
                return <MenuItemCard key={item.id} item={item} index={index} />;
              })}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </TabScreenWrapper>
  );
}
