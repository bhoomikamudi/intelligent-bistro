import { ScalePress } from "../animated/ScalePress";
import { formatPrice } from "../../lib/money";
import { Text, View } from "react-native";

export function CheckoutButton({ total }: { total: number }) {
  return (
    <ScalePress className="overflow-hidden rounded-2xl" scaleTo={0.97} onPress={() => {}}>
      <View
        className="items-center bg-bistro-accent py-[18px]"
        style={{
          shadowColor: "#d4af37",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.45,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <Text className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-800/80">
          Complete reservation
        </Text>
        <Text className="mt-0.5 text-xl font-bold text-stone-950">Checkout · {formatPrice(total)}</Text>
      </View>
    </ScalePress>
  );
}
