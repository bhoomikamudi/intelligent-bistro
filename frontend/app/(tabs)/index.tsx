import { MenuHero } from "../components/menu/MenuHero";
import { MenuItemCard } from "../components/menu/MenuItemCard";
import { TabScreenWrapper } from "../components/TabScreenWrapper";
import { theme } from "../../constants/theme";
import { menuCategories } from "../../data/menu";
import { useRef, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <MenuHero />

        <View style={styles.pillsBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsContent}
          >
            {menuCategories.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => scrollToCategory(cat.id)}
                  style={[styles.pill, active && styles.pillActive]}
                >
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>{cat.title}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {menuCategories.map((cat) => (
            <View key={cat.id} onLayout={onSectionLayout(cat.id)} style={styles.section}>
              <Text style={styles.sectionHeader}>{cat.title}</Text>
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
    paddingVertical: 14,
    flexDirection: "row",
    gap: 10,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  pillActive: {
    backgroundColor: theme.gold,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.textMuted,
    letterSpacing: 0.3,
  },
  pillTextActive: {
    color: theme.bg,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    marginBottom: 14,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
    textTransform: "uppercase",
    color: theme.gold,
  },
});
