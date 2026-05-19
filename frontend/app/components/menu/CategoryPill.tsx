import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text } from "react-native";
import { theme } from "../../../constants/theme";

type CategoryPillProps = {
  title: string;
  active: boolean;
  onPress: () => void;
};

export function CategoryPill({ title, active, onPress }: CategoryPillProps) {
  if (active) {
    return (
      <Pressable onPress={onPress}>
        <LinearGradient
          colors={["#E8C87A", "#C9A84C", "#A68B3E"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.pillActive}
        >
          <Text style={styles.textActive}>{title}</Text>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={styles.pill}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.bgCard,
  },
  pillActive: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 24,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.4,
    color: theme.textSecondary,
  },
  textActive: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.4,
    color: theme.bg,
  },
});
