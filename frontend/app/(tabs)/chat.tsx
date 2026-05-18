import { FormattedMessageText } from "../components/FormattedMessageText";
import { TabScreenWrapper } from "../components/TabScreenWrapper";
import { TypingIndicator } from "../components/TypingIndicator";
import { theme } from "../../constants/theme";
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

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Good evening — welcome to **Intelligent Bistro**. I'm at your table tonight: ask what's worth ordering, tell me your mood, or say the word and I'll build your cart.",
};

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <View style={[styles.bubbleWrap, isUser ? styles.bubbleWrapUser : styles.bubbleWrapAi]}>
      {!isUser && <Text style={styles.bubbleLabel}>Concierge</Text>}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAi]}>
        {isUser ? <Text style={styles.bubbleUserText}>{message.text}</Text> : <FormattedMessageText text={message.text} />}
      </View>
    </View>
  );
}

function TypingBubble() {
  return (
    <View style={[styles.bubbleWrap, styles.bubbleWrapAi]}>
      <Text style={styles.bubbleLabel}>Concierge</Text>
      <View style={[styles.bubble, styles.bubbleAi, styles.typingBubble]}>
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

    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: "user", text }]);
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
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>Concierge</Text>
          <Text style={styles.headerTitle}>Chat</Text>
          <Text style={styles.headerSub}>Curated recommendations and seamless ordering.</Text>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
        >
          <ScrollView
            ref={scrollRef}
            style={styles.messages}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={scrollToEnd}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {loading && <TypingBubble />}
          </ScrollView>

          <SafeAreaView edges={["bottom"]} style={styles.inputBar}>
            <View style={styles.inputRow}>
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
                style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
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
  safe: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.border,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 3,
    textTransform: "uppercase",
    color: theme.gold,
  },
  headerTitle: {
    marginTop: 6,
    fontSize: 30,
    fontWeight: "700",
    color: theme.text,
  },
  headerSub: {
    marginTop: 6,
    fontSize: 14,
    color: theme.textSecondary,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  bubbleWrap: {
    marginBottom: 18,
    maxWidth: "88%",
  },
  bubbleWrapUser: {
    alignSelf: "flex-end",
  },
  bubbleWrapAi: {
    alignSelf: "flex-start",
  },
  bubbleLabel: {
    marginBottom: 6,
    marginLeft: 4,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: theme.textMuted,
  },
  bubble: {
    overflow: "hidden",
  },
  bubbleUser: {
    backgroundColor: theme.gold,
    borderRadius: 18,
    borderBottomRightRadius: 4,
  },
  bubbleAi: {
    backgroundColor: theme.bgElevated,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
  },
  bubbleUserText: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 15,
    lineHeight: 23,
    color: theme.bg,
  },
  typingBubble: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 6,
    backgroundColor: theme.bg,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    backgroundColor: theme.bgElevated,
    borderRadius: 12,
    padding: 8,
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
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: theme.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    opacity: 0.35,
  },
});
