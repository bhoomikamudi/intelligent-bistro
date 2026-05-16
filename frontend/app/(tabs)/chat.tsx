import { TypingIndicator } from "@/components/TypingIndicator";
import { useCart } from "@/context/CartContext";
import { menuForChat } from "@/data/menu";
import { sendChatMessage } from "@/lib/chat";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useCallback, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TextInputKeyPressEventData,
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
  text: "Good evening, and welcome to Intelligent Bistro. I'm your table concierge — ask me what's on the menu, get recommendations, or tell me what you'd like and I'll add it to your cart.",
};

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <View className={`mb-4 max-w-[88%] ${isUser ? "self-end" : "self-start"}`}>
      {!isUser && (
        <Text className="mb-1.5 px-1 text-[11px] font-medium uppercase tracking-wider text-stone-500">
          Concierge
        </Text>
      )}
      <View
        className={`shadow-sm ${
          isUser
            ? "rounded-2xl rounded-br-sm border border-bistro-accent/50 bg-bistro-accent"
            : "rounded-2xl rounded-bl-sm border border-bistro-border bg-bistro-card"
        }`}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Text
          className={`px-4 py-3.5 text-[15px] leading-[22px] ${isUser ? "text-stone-950" : "text-stone-100"}`}
        >
          {message.text}
        </Text>
      </View>
    </View>
  );
}

function TypingBubble() {
  return (
    <View className="mb-4 max-w-[88%] self-start">
      <Text className="mb-1.5 px-1 text-[11px] font-medium uppercase tracking-wider text-stone-500">
        Concierge
      </Text>
      <View className="rounded-2xl rounded-bl-sm border border-bistro-border bg-bistro-card px-5 py-4">
        <TypingIndicator />
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

  const handleSend = useCallback(async () => {
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
        menu: menuForChat,
      });

      applyChatActions(actions, menuForChat);

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
  }, [input, loading, lines, applyChatActions, scrollToEnd]);

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key !== "Enter") return;
    const shiftKey = "shiftKey" in e.nativeEvent && (e.nativeEvent as { shiftKey?: boolean }).shiftKey;
    if (shiftKey) return;
    e.preventDefault?.();
    handleSend();
  };

  const canSend = input.trim().length > 0 && !loading;

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
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
          onContentSizeChange={scrollToEnd}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {loading && <TypingBubble />}
        </ScrollView>

        <SafeAreaView
          edges={["bottom"]}
          className="border-t border-bistro-border bg-stone-950/95 px-4 pb-2 pt-3"
        >
          <View
            className="flex-row items-end gap-2 rounded-2xl border border-bistro-border bg-bistro-card p-2"
            style={{
              shadowColor: "#d4af37",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <TextInput
              className="max-h-24 min-h-[44px] flex-1 px-3 py-2.5 text-base text-stone-100"
              placeholder="Message the concierge..."
              placeholderTextColor="#78716c"
              value={input}
              onChangeText={setInput}
              multiline={Platform.OS === "web"}
              editable={!loading}
              onSubmitEditing={handleSend}
              onKeyPress={handleKeyPress}
              blurOnSubmit={false}
              returnKeyType="send"
              submitBehavior="submit"
            />
            <Pressable
              onPress={handleSend}
              disabled={!canSend}
              className="h-11 w-11 items-center justify-center rounded-xl bg-bistro-accent active:opacity-80 disabled:opacity-35"
            >
              <FontAwesome name="send" size={16} color="#0c0a09" />
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
