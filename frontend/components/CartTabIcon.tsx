import { useCart } from "@/context/CartContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text, View } from "react-native";

export function CartTabIcon({ color }: { color: string }) {
  const { itemCount } = useCart();

  return (
    <View className="relative h-7 w-8 items-center justify-center">
      <FontAwesome name="shopping-cart" size={22} color={color} style={{ marginBottom: -2 }} />
      {itemCount > 0 && (
        <View className="absolute -right-1 -top-0.5 min-h-[16px] min-w-[16px] items-center justify-center rounded-full bg-bistro-accent px-1">
          <Text className="text-[10px] font-bold leading-none text-stone-950">
            {itemCount > 99 ? "99+" : itemCount}
          </Text>
        </View>
      )}
    </View>
  );
}
