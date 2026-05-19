import { StyleSheet, Text, View } from "react-native";
import { serif } from "../../../constants/typography";
import { theme } from "../../../constants/theme";

export function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.dot} />
      <View style={styles.shortLine} />
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    marginTop: 4,
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.gold,
  },
  shortLine: {
    width: 20,
    height: 1,
    backgroundColor: "rgba(201, 168, 76, 0.5)",
  },
  text: {
    fontFamily: serif,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 3,
    textTransform: "uppercase",
    color: theme.gold,
  },
});
