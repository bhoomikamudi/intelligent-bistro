import { CategoryPill } from "../components/menu/CategoryPill";
import { MenuHero } from "../components/menu/MenuHero";
import { MenuItemCard } from "../components/menu/MenuItemCard";
import { SectionHeader } from "../components/menu/SectionHeader";
import { TabScreenWrapper } from "../components/TabScreenWrapper";
import { menuCategories } from "../../data/menu";
import { useRef, useState } from "react";
import { LayoutChangeEvent, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";

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
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <MenuHero />

        <View style={styles.pillsBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.pillsContent}
          >
            {menuCategories.map((cat) => (
              <CategoryPill
                key={cat.id}
                title={cat.title}
                active={activeCategory === cat.id}
                onPress={() => scrollToCategory(cat.id)}
              />
            ))}
          </ScrollView>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {menuCategories.map((cat) => (
            <View key={cat.id} onLayout={onSectionLayout(cat.id)} style={styles.section}>
              <SectionHeader title={cat.title} />
              {cat.items.map((item, itemIdx) => {
                const index = itemIndex++;
                const isLastInSection = itemIdx === cat.items.length - 1;
                const isLastOverall =
                  cat.id === menuCategories[menuCategories.length - 1]?.id && isLastInSection;
                return (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    index={index}
                    isLast={isLastOverall}
                  />
                );
              })}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  pillsBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.border,
    backgroundColor: theme.bg,
  },
  pillsContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    gap: 12,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 8,
  },
});
