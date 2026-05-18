import { FormattedMessageText } from "../../components/FormattedMessageText";
import { TabScreenWrapper } from "../../components/TabScreenWrapper";
import { TypingIndicator } from "../../components/TypingIndicator";
import { useCart } from "../../context/CartContext";
import { menuForChat } from "../../data/menu";
import { sendChatMessage } from "../../lib/chat";
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
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Good evening — welcome to **Intelligent Bistro**. I'm at your table tonight: ask what's worth ordering, tell me your mood, or say the word and I'll build your cart.",
};

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <Animated.View
      entering={FadeIn.duration(280)}
      className={`mb-5 max-w-[90%] ${isUser ? "self-end" : "self-start"}`}
    >
      {!isUser && (
        <Text className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
          Concierge
        </Text>
      )}
      <View
        className={
          isUser
            ? "overflow-hidden rounded-[22px] rounded-br-md border border-bistro-accent/40 bg-bistro-accent"
            : "overflow-hidden rounded-[22px] rounded-bl-md border border-stone-700/50 bg-bistro-card"
        }
        style={{
          shadowColor: isUser ? "#d4af37" : "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isUser ? 0.2 : 0.25,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        {isUser ? (
          <Text className="px-5 py-4 text-[15px] leading-[23px] text-stone-950">{message.text}</Text>
        ) : (
          <FormattedMessageText text={message.text} />
        )}
      </View>
    </Animated.View>
  );
}

function TypingBubble() {
  return (
    <View className="mb-5 max-w-[90%] self-start">
      <Text className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
        Concierge
      </Text>
      <View
        className="rounded-[22px] rounded-bl-md border border-stone-700/50 bg-bistro-card px-6 py-5"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
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

  const buildHistory = useCallback(
    (currentMessages: ChatMessage[]) =>
      currentMessages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.text })),
    [],
  );

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
        history: buildHistory(messages),
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
  }, [input, loading, lines, messages, applyChatActions, buildHistory, scrollToEnd]);

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key !== "Enter") return;
    const shiftKey = "shiftKey" in e.nativeEvent && (e.nativeEvent as { shiftKey?: boolean }).shiftKey;
    if (shiftKey) return;
    e.preventDefault?.();
    handleSend();
  };

  const canSend = input.trim().length > 0 && !loading;

  return (
    <TabScreenWrapper>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <View className="border-b border-bistro-border px-6 pb-5 pt-3">
          <Text className="text-[11px] font-semibold uppercase tracking-[0.28em] text-bistro-accent">
            Concierge
          </Text>
          <Text className="mt-1 text-3xl font-bold tracking-tight text-stone-50">Chat</Text>
          <Text className="mt-2 text-sm leading-5 text-stone-500">
            Curated recommendations and seamless ordering.
          </Text>
        </View>

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
        >
          <ScrollView
            ref={scrollRef}
            className="flex-1 px-5 pt-5"
            contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
            onContentSizeChange={scrollToEnd}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {loading && <TypingBubble />}
          </ScrollView>

          <SafeAreaView edges={["bottom"]} className="px-5 pb-3 pt-4">
            <View
              className="flex-row items-end gap-3 rounded-[20px] border border-bistro-border/80 bg-bistro-card p-2.5"
              style={{
                shadowColor: "#d4af37",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.12,
                shadowRadius: 16,
                elevation: 6,
              }}
            >
              <TextInput
                className="max-h-28 min-h-[48px] flex-1 px-4 py-3 text-base leading-5 text-stone-100"
                placeholder="Message your concierge..."
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
                className="h-12 w-12 items-center justify-center rounded-xl bg-bistro-accent active:opacity-85 disabled:opacity-30"
                style={{
                  shadowColor: "#d4af37",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: canSend ? 0.35 : 0,
                  shadowRadius: 8,
                }}
              >
                <FontAwesome name="send" size={17} color="#0c0a09" />
              </Pressable>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TabScreenWrapper>
  );
}
