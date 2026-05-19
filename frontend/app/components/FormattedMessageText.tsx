import { Fragment, type ReactNode } from "react";
import { Text } from "react-native";

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
      <Text key={`b-${key++}`} className="font-bold text-text-primary">
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
    <Text className="px-[18px] py-3.5 text-[15px] leading-[23px] text-text-primary">
      {lines.map((line, index) => {
        const headerMatch = line.match(/^##\s+(.+)$/);
        const isLast = index === lines.length - 1;

        if (headerMatch) {
          return (
            <Text
              key={`h-${index}`}
              className={`text-[15px] font-semibold text-gold ${index > 0 ? "mt-2.5" : ""}`}
            >
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
