import { FormattedMessageText } from "../components/FormattedMessageText";
import { TabScreenWrapper } from "../components/TabScreenWrapper";
import { TypingIndicator } from "../components/TypingIndicator";
import { theme } from "../../constants/theme";
import { useCart } from "../../context/CartContext";
import { menuForChat } from "../../data/menu";
import { sendChatMessage } from "../../lib/chat";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
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

const SUGGESTION_CHIPS = [
  "What's good tonight? 🍽️",
  "Any vegetarian options? 🥗",
  "Surprise me 🎲",
] as const;

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <View className={`mb-[18px] max-w-[88%] ${isUser ? "self-end" : "self-start"}`}>
      {!isUser && (
        <Text className="mb-1.5 ml-1 text-[10px] font-semibold uppercase tracking-[2px] text-muted">Concierge</Text>
      )}
      <View className={`overflow-hidden ${isUser ? "rounded-[18px] rounded-br-sm bg-gold" : "rounded-[18px] rounded-bl-sm bg-elevated"}`}>
        {isUser ? (
          <Text className="px-[18px] py-3.5 text-[15px] leading-[23px] text-bistro">{message.text}</Text>
        ) : (
          <FormattedMessageText text={message.text} />
        )}
      </View>
    </View>
  );
}

function TypingBubble() {
  return (
    <View className="mb-[18px] max-w-[88%] self-start">
      <Text className="mb-1.5 ml-1 text-[10px] font-semibold uppercase tracking-[2px] text-muted">Concierge</Text>
      <View className="overflow-hidden rounded-[18px] rounded-bl-sm bg-elevated px-5 py-4">
        <TypingIndicator />
      </View>
    </View>
  );
}

function ChatWelcome({ onChipPress }: { onChipPress: (text: string) => void }) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-8">
      <View className="mb-5 h-24 w-24 items-center justify-center rounded-full border border-gold/25 bg-elevated">
        <Text className="text-5xl">🍽️</Text>
      </View>
      <Text className="text-center text-[22px] font-bold tracking-[3px] text-text-primary">
        INTELLIGENT BISTRO
      </Text>
      <Text className="mt-3 text-center text-[15px] text-muted">Your personal dining concierge</Text>
      <View className="mt-8 w-full max-w-[340px] gap-3">
        {SUGGESTION_CHIPS.map((chip) => (
          <Pressable
            key={chip}
            onPress={() => onChipPress(chip)}
            className="rounded-xl border border-gold/40 bg-card px-4 py-3.5 active:opacity-80"
          >
            <Text className="text-center text-[15px] text-text-primary">{chip}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const { lines, applyChatActions } = useCart();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const cartSnapshotRef = useRef(lines);

  useEffect(() => {
    cartSnapshotRef.current = lines;
  }, [lines]);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const buildHistory = useCallback(
    (currentMessages: ChatMessage[]) =>
      currentMessages.map((m) => ({ role: m.role, content: m.text })),
    [],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: "user", text: trimmed };
      const conversationWithUser = [...messages, userMessage];
      const conversationForApi = buildHistory(conversationWithUser);

      setMessages(conversationWithUser);
      setInput("");
      setLoading(true);
      scrollToEnd();

      try {
        const { message, actions } = await sendChatMessage({
          messages: conversationForApi,
          cart: cartSnapshotRef.current.map((line) => ({
            item_id: line.item.id,
            quantity: line.quantity,
            name: line.item.name,
            price: line.item.price,
          })),
          menu: menuForChat,
        });

        applyChatActions(actions, menuForChat);
        setMessages((prev) => [...prev, { id: `assistant-${Date.now()}`, role: "assistant", text: message }]);
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
    },
    [loading, messages, applyChatActions, buildHistory, scrollToEnd],
  );

  const handleSend = useCallback(() => {
    sendMessage(input);
  }, [input, sendMessage]);

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key !== "Enter") return;
    const shiftKey = "shiftKey" in e.nativeEvent && (e.nativeEvent as { shiftKey?: boolean }).shiftKey;
    if (shiftKey) return;
    e.preventDefault?.();
    handleSend();
  };

  const canSend = input.trim().length > 0 && !loading;
  const showWelcome = messages.length === 0 && !loading;

  return (
    <TabScreenWrapper>
      <SafeAreaView className="flex-1 bg-bistro" edges={["top"]}>
        <View className="border-b border-[#222222] px-6 pb-[18px] pt-3">
          <Text className="text-[11px] font-semibold uppercase tracking-[3px] text-gold">Concierge</Text>
          <Text className="mt-1.5 text-[30px] font-bold text-text-primary">Chat</Text>
          <Text className="mt-1.5 text-sm text-muted">Curated recommendations and seamless ordering.</Text>
        </View>

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : Platform.OS === "android" ? "height" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
        >
          <ScrollView
            ref={scrollRef}
            className="flex-1"
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={scrollToEnd}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            {showWelcome ? <ChatWelcome onChipPress={sendMessage} /> : null}
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {loading && <TypingBubble />}
          </ScrollView>

          <SafeAreaView edges={["bottom"]} className="bg-bistro px-5 pb-1.5 pt-3">
            <View className="flex-row items-end gap-2.5 rounded-xl bg-elevated p-2">
              <TextInput
                style={styles.input}
                placeholder="Message your concierge..."
                placeholderTextColor={theme.textMuted}
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
                className={`h-11 w-11 items-center justify-center rounded-lg bg-gold ${!canSend ? "opacity-35" : ""}`}
              >
                <FontAwesome name="send" size={16} color={theme.bg} />
              </Pressable>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  messagesContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.gold,
    borderRadius: 8,
    backgroundColor: theme.bgCard,
  },
});
