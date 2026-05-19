import { CartTabIcon } from "../components/CartTabIcon";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GOLD = "#C9A84C";
const MUTED = "#8A8070";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

function TabIcon({
  focused,
  activeName,
  inactiveName,
}: {
  focused: boolean;
  activeName: IoniconName;
  inactiveName: IoniconName;
}) {
  return (
    <Ionicons
      name={focused ? activeName : inactiveName}
      size={24}
      color={focused ? GOLD : MUTED}
    />
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const tabBarBottom = insets.bottom + 8;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        lazy: false,
        animation: "fade",
        tabBarActiveTintColor: GOLD,
        tabBarInactiveTintColor: MUTED,
        tabBarStyle: {
          backgroundColor: "#000000",
          borderTopColor: GOLD,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: tabBarBottom,
          height: 56 + tabBarBottom,
        },
        tabBarLabel: ({ focused, color, children }) => (
          <Text
            style={{
              color,
              fontSize: focused ? 12 : 11,
              fontWeight: focused ? "700" : "600",
              letterSpacing: 0.3,
              marginTop: 2,
            }}
          >
            {children}
          </Text>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Menu",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} activeName="restaurant" inactiveName="restaurant-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ focused }) => <CartTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} activeName="chatbubble" inactiveName="chatbubble-outline" />
          ),
        }}
      />
    </Tabs>
  );
}
