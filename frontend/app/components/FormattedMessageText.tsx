import { Fragment, type ReactNode } from "react";
import { StyleSheet, Text } from "react-native";
import { theme } from "../../constants/theme";

const GOLD = "#C9A84C";
const BOLD_REGEX = /\*\*(.+?)\*\*/g;

function renderBoldLine(line: string) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  BOLD_REGEX.lastIndex = 0;
  while ((match = BOLD_REGEX.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<Fragment key={`t-${key++}`}>{line.slice(lastIndex, match.index)}</Fragment>);
    }
    parts.push(
      <Text key={`b-${key++}`} style={styles.bold}>
        {match[1]}
      </Text>,
    );
    lastIndex = BOLD_REGEX.lastIndex;
  }

  if (lastIndex < line.length) {
    parts.push(<Fragment key={`t-${key++}`}>{line.slice(lastIndex)}</Fragment>);
  }

  return parts.length > 0 ? parts : line;
}

export function FormattedMessageText({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <Text style={styles.body}>
      {lines.map((line, index) => {
        const headerMatch = line.match(/^##\s+(.+)$/);
        const isLast = index === lines.length - 1;

        if (headerMatch) {
          return (
            <Text key={`h-${index}`} style={[styles.header, index > 0 && styles.headerSpaced]}>
              {headerMatch[1]}
              {!isLast ? "\n" : ""}
            </Text>
          );
        }

        return (
          <Text key={`l-${index}`}>
            {renderBoldLine(line)}
            {!isLast ? "\n" : ""}
          </Text>
        );
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 15,
    lineHeight: 22.5,
    color: theme.text,
  },
  bold: {
    fontWeight: "700",
    color: theme.text,
  },
  header: {
    fontSize: 15,
    fontWeight: "600",
    color: GOLD,
  },
  headerSpaced: {
    marginTop: 10,
  },
});
