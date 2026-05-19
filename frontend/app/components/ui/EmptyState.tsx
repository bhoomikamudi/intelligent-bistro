import { Link, type Href } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { serif } from "../../../constants/typography";
import { theme } from "../../../constants/theme";

const GOLD = "#C9A84C";
const BISTRO_DARK = "#080808";

type EmptyStateProps = {
  emoji: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  actionHref?: Href;
};

export function EmptyState({ emoji, title, subtitle, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.emojiRing}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {actionLabel && actionHref ? (
        <Link href={actionHref} asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>{actionLabel}</Text>
          </Pressable>
        </Link>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emojiRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(201, 168, 76, 0.35)",
    backgroundColor: theme.bgElevated,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emoji: {
    fontSize: 48,
    lineHeight: 56,
  },
  title: {
    fontFamily: serif,
    fontSize: 24,
    fontWeight: "600",
    color: theme.text,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    maxWidth: 280,
    fontSize: 15,
    lineHeight: 22.5,
    color: theme.textSecondary,
    textAlign: "center",
  },
  button: {
    marginTop: 28,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    backgroundColor: GOLD,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.4,
    color: BISTRO_DARK,
  },
});
