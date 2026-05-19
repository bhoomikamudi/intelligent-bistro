import { useCart } from "../../context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

const GOLD = "#C9A84C";
const MUTED = "#8A8070";

export function CartTabIcon({ focused }: { focused: boolean }) {
  const { itemCount } = useCart();
  const color = focused ? GOLD : MUTED;

  return (
    <View className="relative h-7 w-8 items-center justify-center">
      <Ionicons name={focused ? "cart" : "cart-outline"} size={24} color={color} />
      {itemCount > 0 ? (
        <View className="absolute -right-1 -top-0.5 min-h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1">
          <Text className="text-[10px] font-bold text-white">{itemCount > 99 ? "99+" : itemCount}</Text>
        </View>
      ) : null}
    </View>
  );
}
