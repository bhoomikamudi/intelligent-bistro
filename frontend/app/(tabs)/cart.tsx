import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bistro-bg" edges={["top"]}>
      <View className="border-b border-bistro-border px-5 pb-4 pt-2">
        <Text className="text-2xl font-bold text-stone-50">Cart</Text>
        <Text className="mt-1 text-sm text-stone-500">Items you add from the menu will show up here.</Text>
      </View>
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-center text-5xl">🛒</Text>
        <Text className="mt-4 text-center text-base text-stone-400">Your cart is empty.</Text>
      </View>
    </SafeAreaView>
  );
}
