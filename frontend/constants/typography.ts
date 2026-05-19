import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const serif = "Georgia";

export const typography = StyleSheet.create({
  screenTitle: {
    fontFamily: serif,
    fontSize: 30,
    fontWeight: "700",
    color: theme.text,
    letterSpacing: 0.5,
  },
  sectionHeader: {
    fontFamily: serif,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 3,
    textTransform: "uppercase",
    color: theme.gold,
  },
  body: {
    fontSize: 15,
    lineHeight: 22.5,
    color: theme.text,
  },
  bodyMuted: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.textSecondary,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.gold,
  },
  labelCaps: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 3,
    textTransform: "uppercase",
    color: theme.gold,
  },
});
