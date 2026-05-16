import { useCart } from "@/context/CartContext";
import { allMenuItems } from "@/data/menu";
import { sendChatMessage } from "@/lib/chat";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Welcome to Intelligent Bistro. Ask me about the menu, or tell me what you'd like to order.",
};

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <View className={`mb-3 max-w-[85%] ${isUser ? "self-end" : "self-start"}`}>
      <View
        className={`rounded-2xl px-4 py-3 ${
          isUser
            ? "rounded-br-md border border-bistro-accent/30 bg-bistro-accent"
            : "rounded-bl-md border border-bistro-border bg-bistro-card"
        }`}
      >
        <Text className={`text-[15px] leading-5 ${isUser ? "text-stone-950" : "text-stone-100"}`}>
          {message.text}
        </Text>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const { lines, applyChatActions } = useCart();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    scrollToEnd();

    try {
      const { message, actions } = await sendChatMessage({
        message: text,
        cart: lines.map((line) => ({
          item_id: line.item.id,
          quantity: line.quantity,
          name: line.item.name,
          price: line.item.price,
        })),
        menu: allMenuItems,
      });

      applyChatActions(actions, allMenuItems);

      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: "assistant", text: message },
      ]);
    } catch (err) {
      const errorText = err instanceof Error ? err.message : "Something went wrong.";
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          text: `Sorry, I couldn't reach the kitchen: ${errorText}`,
        },
      ]);
    } finally {
      setLoading(false);
      scrollToEnd();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bistro-bg" edges={["top"]}>
      <View className="border-b border-bistro-border px-5 pb-4 pt-2">
        <Text className="text-2xl font-bold text-stone-50">Chat</Text>
        <Text className="mt-1 text-sm text-stone-500">Your AI concierge for menu and ordering.</Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-4 pt-4"
          contentContainerStyle={{ paddingBottom: 16, flexGrow: 1 }}
          onContentSizeChange={scrollToEnd}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {loading && (
            <View className="mb-3 self-start rounded-2xl rounded-bl-md border border-bistro-border bg-bistro-card px-4 py-3">
              <ActivityIndicator color="#d4af37" />
            </View>
          )}
        </ScrollView>

        <SafeAreaView edges={["bottom"]} className="border-t border-bistro-border bg-bistro-card px-4 py-3">
          <View className="flex-row items-end gap-2">
            <TextInput
              className="max-h-28 flex-1 rounded-xl border border-bistro-border bg-stone-900 px-4 py-3 text-base text-stone-100"
              placeholder="Ask about the menu or your order..."
              placeholderTextColor="#78716c"
              value={input}
              onChangeText={setInput}
              multiline
              editable={!loading}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <Pressable
              onPress={handleSend}
              disabled={loading || !input.trim()}
              className="rounded-xl bg-bistro-accent px-4 py-3 active:opacity-80 disabled:opacity-40"
            >
              <Text className="font-semibold text-stone-950">Send</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
