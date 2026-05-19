import { Link, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";

type EmptyStateProps = {
  emoji: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  actionHref?: Href;
};

export function EmptyState({ emoji, title, subtitle, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-10">
      <View className="mb-6 h-24 w-24 items-center justify-center rounded-full border border-gold/25 bg-elevated">
        <Text className="text-5xl">{emoji}</Text>
      </View>
      <Text className="text-center text-[22px] font-semibold text-text-primary">{title}</Text>
      <Text className="mt-2.5 max-w-[280px] text-center text-[15px] leading-[22px] text-muted">{subtitle}</Text>
      {actionLabel && actionHref ? (
        <Link href={actionHref} asChild>
          <Pressable className="mt-8 rounded-lg bg-gold px-8 py-3.5 active:opacity-90">
            <Text className="text-sm font-bold tracking-wide text-bistro">{actionLabel}</Text>
          </Pressable>
        </Link>
      ) : null}
    </View>
  );
}
