import { FormattedMessageText } from "../components/FormattedMessageText";
import { TabScreenWrapper } from "../components/TabScreenWrapper";
import { TypingIndicator } from "../components/TypingIndicator";
import { serif, typography } from "../../constants/typography";
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

const GOLD = "#C9A84C";
const BISTRO_DARK = "#080808";
const MUTED_GOLD_PLACEHOLDER = "#7A6530";

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <View style={[styles.bubbleWrap, isUser ? styles.bubbleWrapUser : styles.bubbleWrapAi]}>
      {!isUser && <Text style={styles.conciergeLabel}>CONCIERGE</Text>}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAi]}>
        {isUser ? <Text style={styles.userText}>{message.text}</Text> : <FormattedMessageText text={message.text} />}
      </View>
    </View>
  );
}

function TypingBubble() {
  return (
    <View style={[styles.bubbleWrap, styles.bubbleWrapAi]}>
      <Text style={styles.conciergeLabel}>CONCIERGE</Text>
      <View style={[styles.bubble, styles.bubbleAi, styles.typingBubble]}>
        <TypingIndicator />
      </View>
    </View>
  );
}

function ChatWelcome({ onChipPress }: { onChipPress: (text: string) => void }) {
  return (
    <View style={styles.welcome}>
      <View style={styles.welcomeLogo}>
        <Text style={styles.welcomeEmoji}>🍽️</Text>
      </View>
      <View style={styles.welcomeDivider} />
      <Text style={styles.welcomeTitle}>Intelligent Bistro</Text>
      <Text style={styles.welcomeSub}>Your personal dining concierge</Text>
      <View style={styles.chips}>
        {SUGGESTION_CHIPS.map((chip) => (
          <Pressable key={chip} onPress={() => onChipPress(chip)} style={styles.chip}>
            <Text style={styles.chipText}>{chip}</Text>
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
  const [inputFocused, setInputFocused] = useState(false);
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
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.header}>
          <Text style={typography.labelCaps}>Concierge</Text>
          <Text style={[typography.screenTitle, styles.chatTitle]}>Chat</Text>
          <Text style={styles.headerSub}>Curated recommendations and seamless ordering.</Text>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : Platform.OS === "android" ? "height" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
        >
          <ScrollView
            ref={scrollRef}
            style={styles.flex}
            contentContainerStyle={showWelcome ? styles.messagesWelcome : styles.messagesContent}
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

          <SafeAreaView edges={["bottom"]} style={styles.inputBar}>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, inputFocused && styles.inputFocused]}
                placeholder="Message your concierge..."
                placeholderTextColor={MUTED_GOLD_PLACEHOLDER}
                value={input}
                onChangeText={setInput}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
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
                <FontAwesome name="send" size={16} color={BISTRO_DARK} />
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
  chatTitle: {
    marginTop: 6,
  },
  headerSub: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    color: theme.textSecondary,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  messagesWelcome: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  welcome: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    minHeight: 420,
  },
  welcomeLogo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: "rgba(201, 168, 76, 0.4)",
    backgroundColor: theme.bgCard,
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeEmoji: {
    fontSize: 48,
    lineHeight: 52,
  },
  welcomeDivider: {
    width: 56,
    height: 1,
    backgroundColor: GOLD,
    marginTop: 20,
    marginBottom: 16,
    opacity: 0.7,
  },
  welcomeTitle: {
    fontFamily: serif,
    fontSize: 22,
    fontWeight: "600",
    color: GOLD,
    letterSpacing: 1,
  },
  welcomeSub: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19.5,
    color: theme.textSecondary,
  },
  chips: {
    marginTop: 32,
    width: "100%",
    gap: 12,
    paddingHorizontal: 0,
  },
  chip: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: GOLD,
    backgroundColor: theme.bgCard,
  },
  chipText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    color: GOLD,
    lineHeight: 22.5,
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
  conciergeLabel: {
    marginBottom: 6,
    marginLeft: 4,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 3,
    textTransform: "uppercase",
    color: GOLD,
  },
  bubble: {
    overflow: "hidden",
  },
  bubbleUser: {
    backgroundColor: GOLD,
    borderRadius: 18,
    borderBottomRightRadius: 4,
  },
  bubbleAi: {
    backgroundColor: theme.bgElevated,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
  },
  userText: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 15,
    lineHeight: 22.5,
    color: BISTRO_DARK,
    fontWeight: "500",
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
    minHeight: 48,
    maxHeight: 100,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 24,
    color: theme.text,
    borderWidth: 1,
    borderColor: "rgba(201, 168, 76, 0.35)",
    borderRadius: 10,
    backgroundColor: theme.bgCard,
  },
  inputFocused: {
    borderColor: GOLD,
    borderWidth: 1.5,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    opacity: 0.35,
  },
});
