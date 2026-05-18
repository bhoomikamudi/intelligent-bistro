import { MenuHero } from "../components/menu/MenuHero";
import { MenuItemCard } from "../components/menu/MenuItemCard";
import { TabScreenWrapper } from "../components/TabScreenWrapper";
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
      <SafeAreaView className="flex-1 bg-bistro" edges={["top"]}>
        <MenuHero />

        <View className="border-b border-[#222222] bg-bistro">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 14, flexDirection: "row", gap: 10 }}
          >
            {menuCategories.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => scrollToCategory(cat.id)}
                  className={`rounded-[20px] px-[18px] py-2.5 ${active ? "bg-gold" : "bg-transparent"}`}
                >
                  <Text
                    className={`text-[13px] font-semibold tracking-wide ${active ? "text-bistro" : "text-muted"}`}
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
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {menuCategories.map((cat) => (
            <View key={cat.id} onLayout={onSectionLayout(cat.id)} className="mb-7">
              <Text className="mb-3.5 text-[11px] font-bold uppercase tracking-[3px] text-gold">{cat.title}</Text>
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
