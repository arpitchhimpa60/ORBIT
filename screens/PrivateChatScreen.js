
import { useState, useContext, useCallback, useRef } from "react";

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

import OrbitalBackground from "../components/OrbitalBackground";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { apiRequest } from "../services/api";

export default function PrivateChatScreen({ navigation, route }) {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const { conversationId, otherUser } = route.params;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const flatListRef = useRef(null);

  // Fetch messages from the backend
  const fetchMessages = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setIsLoading(true);
      }

      setError("");

      const token = await SecureStore.getItemAsync("userToken");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const result = await apiRequest(
        `/api/messages/${conversationId}`,
        "GET",
        null,
        token
      );

      setMessages(result.messages);
    } catch (error) {
      console.log("Fetch messages error:", error.message);
      setError(error.message || "Unable to load messages.");
    } finally {
      if (showLoader) {
        setIsLoading(false);
      }
    }
  }, [conversationId]);

  // Fetch messages whenever the chat screen opens
  useFocusEffect(
    useCallback(() => {
      fetchMessages();
    }, [fetchMessages])
  );

  // Send a new message
  async function sendMessage() {
    const messageText = text.trim();

    if (!messageText || isSending) {
      return;
    }

    try {
      setIsSending(true);

      const token = await SecureStore.getItemAsync("userToken");

      if (!token) {
        throw new Error("Please log in again.");
      }

      await apiRequest(
        "/api/messages",
        "POST",
        {
          conversationId: conversationId,
          text: messageText,
        },
        token
      );

      setText("");

      // Fetch the updated message list
      await fetchMessages(false);
    } catch (error) {
      console.log("Send message error:", error.message);

      Alert.alert(
        "Message not sent",
        error.message || "Something went wrong."
      );
    } finally {
      setIsSending(false);
    }
  }

  // Check whether a message belongs to the logged-in user
    function isMyMessage(message) {
    const senderId = message.sender?._id || message.sender;

    const currentUserId = user?._id || user?.id;

    return String(senderId) === String(currentUserId);
    }

  // Theme-aware styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 15,
      paddingTop: 15,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },

    backButton: {
      marginRight: 15,
      padding: 8,
    },

    backText: {
      color: theme.text,
      fontSize: 28,
    },

    userName: {
      color: theme.text,
      fontSize: 19,
      fontWeight: "bold",
    },

    username: {
      color: theme.secondaryText,
      fontSize: 13,
      marginTop: 4,
    },

    messageList: {
      flex: 1,
    },

    messageListContent: {
      paddingVertical: 15,
      flexGrow: 1,
      justifyContent: "flex-end",
    },

    messageRow: {
      flexDirection: "row",
      marginBottom: 12,
    },

    myMessageRow: {
      justifyContent: "flex-end",
    },

    otherMessageRow: {
      justifyContent: "flex-start",
    },

    messageBubble: {
      maxWidth: "80%",
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 16,
    },

    myMessageBubble: {
      backgroundColor: theme.primary,
      borderBottomRightRadius: 4,
    },

    otherMessageBubble: {
      backgroundColor: theme.card,
      borderBottomLeftRadius: 4,
      borderWidth: 1,
      borderColor: theme.border,
    },

    messageText: {
      color: "#FFFFFF",
      fontSize: 15,
      lineHeight: 21,
    },

    otherMessageText: {
      color: theme.text,
    },

    emptyText: {
      color: theme.secondaryText,
      fontSize: 14,
      textAlign: "center",
      marginVertical: 20,
    },

    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    errorText: {
      color: theme.secondaryText,
      textAlign: "center",
      marginTop: 20,
    },

    retryButton: {
      alignSelf: "center",
      marginTop: 12,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: theme.button,
    },

    retryButtonText: {
      color: theme.buttonText,
      fontWeight: "bold",
    },

    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      gap: 10,
    },

    messageInput: {
      flex: 1,
      backgroundColor: theme.input,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 24,
      paddingHorizontal: 17,
      paddingVertical: 12,
      fontSize: 14,
      maxHeight: 100,
    },

    sendButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.button,
      justifyContent: "center",
      alignItems: "center",
    },

    disabledButton: {
      opacity: 0.5,
    },

    sendButtonText: {
      color: theme.buttonText,
      fontSize: 22,
      fontWeight: "bold",
    },
  });

  // Display each message
  function renderMessage({ item }) {
    const mine = isMyMessage(item);

    return (
      <View
        style={[
          styles.messageRow,
          mine ? styles.myMessageRow : styles.otherMessageRow,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            mine ? styles.myMessageBubble : styles.otherMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              !mine && styles.otherMessageText,
            ]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <OrbitalBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <View style={styles.container}>
          {/* Chat header */}
          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backText}>‹</Text>
            </Pressable>

            <View>
              <Text style={styles.userName}>{otherUser.name}</Text>

              <Text style={styles.username}>
                @{otherUser.username}
              </Text>
            </View>
          </View>

          {/* Messages */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={theme.highlight}
              />
            </View>
          ) : error ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.errorText}>{error}</Text>

              <Pressable
                style={styles.retryButton}
                onPress={() => fetchMessages()}
              >
                <Text style={styles.retryButtonText}>
                  Try Again
                </Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              style={styles.messageList}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.messageListContent}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No messages yet. Say hello!
                </Text>
              }
            />
          )}

          {/* Message input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type a message..."
              placeholderTextColor={theme.placeholder}
              value={text}
              onChangeText={setText}
              multiline
              maxLength={2000}
              editable={!isSending}
            />

            <Pressable
              style={[
                styles.sendButton,
                (!text.trim() || isSending) && styles.disabledButton,
              ]}
              onPress={sendMessage}
              disabled={!text.trim() || isSending}
            >
              {isSending ? (
                <ActivityIndicator color={theme.buttonText} />
              ) : (
                <Text style={styles.sendButtonText}>➤</Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </OrbitalBackground>
  );
}
