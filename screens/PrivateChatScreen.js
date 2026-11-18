
import {
  useState,
  useContext,
  useCallback,
  useRef,
} from "react";

import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

import OrbitalBackground from "../components/OrbitalBackground";
import ImagePicker from "../components/imagePicker/ImagePicker";
import ImagePreview from "../components/imagePicker/ImagePreview";

import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { apiRequest } from "../services/api";
import { socket } from "../services/socket";

export default function PrivateChatScreen({ navigation, route }) {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const { conversationId, otherUser } = route.params;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  // Store the selected image temporarily
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedReply, setSelectedReply] = useState(null);

  // Store the URL of the image opened in full-screen view
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const flatListRef = useRef(null);

  // Store delivery updates that arrive before their messages
  const pendingStatusUpdates = useRef({});

  // Get the logged-in user's ID
  function getCurrentUserId() {
    return user?._id || user?.id;
  }

  // Check whether a message belongs to the logged-in user
  function isMyMessage(message) {
    const senderId = message.sender?._id || message.sender;

    return String(senderId) === String(getCurrentUserId());
  }

  // Acknowledge a message received from another user
  function acknowledgeMessage(message) {
    if (!message || isMyMessage(message)) {
      return;
    }

    if (message.status === "delivered") {
      return;
    }

    socket.emit("messageDelivered", {
      messageId: message._id,
    });
  }

  // Select a message to reply to
  function selectReply(message) {
    setSelectedReply(message);
  }

  // Cancel the current reply
  function cancelReply() {
    setSelectedReply(null);
  }

  // Get a short preview of a message being replied to
  function getReplyPreview(message) {
    if (!message) {
      return "Original message unavailable";
    }

    if (message.type === "image") {
      return "Photo";
    }

    return message.text || "Message";
  }

  // Open the device gallery
  async function pickImage() {
    const image = await ImagePicker();

    if (image) {
      setSelectedImage(image);
    }
  }

  // Cancel the selected image
  function cancelImagePreview() {
    setSelectedImage(null);
  }

  // Upload and send the selected image
  async function handleImageSend() {
    if (!selectedImage || !selectedImage.base64 || isSending) {
      return;
    }

    try {
      setIsSending(true);

      const token = await SecureStore.getItemAsync("userToken");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const result = await apiRequest(
        "/api/messages",
        "POST",
        {
          conversationId: conversationId,
          type: "image",
          imageBase64: selectedImage.base64,
          mimeType: selectedImage.mimeType || "image/jpeg",
          replyToId: selectedReply?._id,
        },
        token
      );

      // Add the saved image message to the chat
      addMessage(result.newMessage);

      // Close the image preview after successful sending
      setSelectedImage(null);
      setSelectedReply(null);
    } catch (error) {
      console.log("Send image error:", error.message);

      Alert.alert(
        "Image not sent",
        error.message || "Unable to upload this image. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  }

  // Mark this conversation as read
  const markConversationRead = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");

      if (!token) {
        return;
      }

      await apiRequest(
        `/api/conversations/${conversationId}/read`,
        "PATCH",
        null,
        token
      );
    } catch (error) {
      console.log("Mark conversation read error:", error.message);
    }
  }, [conversationId]);

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

      // Acknowledge previously sent messages when opening the chat
      result.messages.forEach((message) => {
        acknowledgeMessage(message);
      });
    } catch (error) {
      console.log("Fetch messages error:", error.message);
      setError(error.message || "Unable to load messages.");
    } finally {
      if (showLoader) {
        setIsLoading(false);
      }
    }
  }, [conversationId, user]);

  // Add a message without creating duplicates
  const addMessage = useCallback((newMessage) => {
    setMessages((previousMessages) => {
      const pendingUpdate = pendingStatusUpdates.current[newMessage._id];

      const messageToAdd = pendingUpdate
        ? {
            ...newMessage,
            status: pendingUpdate.status,
            deliveredAt: pendingUpdate.deliveredAt,
          }
        : newMessage;

      if (pendingUpdate) {
        delete pendingStatusUpdates.current[newMessage._id];
      }

      const messageIndex = previousMessages.findIndex(
        (message) => message._id === newMessage._id
      );

      if (messageIndex !== -1) {
        const updatedMessages = [...previousMessages];

        updatedMessages[messageIndex] = {
          ...updatedMessages[messageIndex],
          ...messageToAdd,
        };

        return updatedMessages;
      }

      return [...previousMessages, messageToAdd];
    });
  }, []);

  // Update the status of an existing message
  const updateMessageStatus = useCallback((statusUpdate) => {
    setMessages((previousMessages) => {
      const messageIndex = previousMessages.findIndex(
        (message) => message._id === statusUpdate.messageId
      );

      if (messageIndex === -1) {
        // Keep the update until the message is added
        pendingStatusUpdates.current[statusUpdate.messageId] = statusUpdate;

        return previousMessages;
      }

      const updatedMessages = [...previousMessages];

      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        status: statusUpdate.status,
        deliveredAt: statusUpdate.deliveredAt,
      };

      return updatedMessages;
    });
  }, []);

  // Fetch history and listen for real-time messages
  useFocusEffect(
    useCallback(() => {
      fetchMessages();

      // Mark the conversation as read when it opens
      markConversationRead();

      function handleNewMessage(newMessage) {
        // Ignore messages from other conversations
        if (
          String(newMessage.conversation) !== String(conversationId)
        ) {
          return;
        }

        addMessage(newMessage);

        // Acknowledge only messages sent by another user
        acknowledgeMessage(newMessage);

        // This chat is currently open, so mark it as read
        if (!isMyMessage(newMessage)) {
          markConversationRead();
        }
      }

      function handleMessageStatusUpdated(statusUpdate) {
        updateMessageStatus(statusUpdate);
      }

      // Refresh history after reconnecting
      function handleSocketConnect() {
        fetchMessages(false);
        markConversationRead();
      }

      socket.on("newMessage", handleNewMessage);
      socket.on("messageStatusUpdated", handleMessageStatusUpdated);
      socket.on("connect", handleSocketConnect);

      return () => {
        socket.off("newMessage", handleNewMessage);
        socket.off("messageStatusUpdated", handleMessageStatusUpdated);
        socket.off("connect", handleSocketConnect);
      };
    }, [
      conversationId,
      fetchMessages,
      addMessage,
      updateMessageStatus,
      markConversationRead,
      user,
    ])
  );

  // Send a new text message
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

      const result = await apiRequest(
        "/api/messages",
        "POST",
        {
          conversationId: conversationId,
          text: messageText,
          replyToId: selectedReply?._id,
        },
        token
      );

      // Add the saved message from the HTTP response
      // addMessage prevents duplicates from Socket.IO
      addMessage(result.newMessage);

      setText("");
      setSelectedReply(null);
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

    replyPreview: {
      backgroundColor: "rgba(0, 0, 0, 0.15)",
      borderLeftWidth: 3,
      borderLeftColor: theme.highlight,
      borderRadius: 8,
      padding: 8,
      marginBottom: 8,
    },

    replyAuthor: {
      color: theme.highlight,
      fontSize: 12,
      fontWeight: "bold",
      marginBottom: 3,
    },

    replyContent: {
      color: theme.text,
      fontSize: 12,
    },

    replyImagePreview: {
      width: 55,
      height: 45,
      borderRadius: 5,
      marginTop: 4,
    },

    replyComposer: {
      backgroundColor: theme.card,
      borderLeftWidth: 3,
      borderLeftColor: theme.highlight,
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
    },

    replyComposerDetails: {
      flex: 1,
    },

    replyCancelButton: {
      paddingHorizontal: 10,
      paddingVertical: 5,
    },

    replyCancelText: {
      color: theme.text,
      fontSize: 20,
      fontWeight: "bold",
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

    messageImage: {
      width: 220,
      height: 200,
      borderRadius: 10,
      resizeMode: "contain",
      backgroundColor: theme.background,
    },

    fullScreenContainer: {
      flex: 1,
      backgroundColor: "#000000",
      justifyContent: "center",
      alignItems: "center",
    },

    fullScreenImage: {
      width: "100%",
      height: "100%",
    },

    closeImageButton: {
      position: "absolute",
      top: 55,
      left: 20,
      zIndex: 1,
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: "#333333",
      justifyContent: "center",
      alignItems: "center",
    },

    closeImageText: {
      color: "#FFFFFF",
      fontSize: 27,
      fontWeight: "bold",
    },

    otherMessageText: {
      color: theme.text,
    },

    messageStatus: {
      color: theme.secondaryText,
      fontSize: 11,
      textAlign: "right",
      marginTop: 5,
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

    attachmentButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: "center",
      alignItems: "center",
    },

    attachmentButtonText: {
      color: theme.text,
      fontSize: 25,
      fontWeight: "bold",
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
        <Pressable
          onLongPress={() => selectReply(item)}
          delayLongPress={350}
          style={[
            styles.messageBubble,
            mine ? styles.myMessageBubble : styles.otherMessageBubble,
          ]}
        >
          {item.replyTo && (
            <View style={styles.replyPreview}>
              <Text style={styles.replyAuthor}>
                {item.replyTo.sender?.name || "ORBIT User"}
              </Text>

              <Text style={styles.replyContent} numberOfLines={2}>
                {getReplyPreview(item.replyTo)}
              </Text>

              {item.replyTo.type === "image" && item.replyTo.imageUrl && (
                <Image
                  source={{ uri: item.replyTo.imageUrl }}
                  style={styles.replyImagePreview}
                />
              )}
            </View>
          )}

          {item.type === "image" && item.imageUrl ? (
            <Pressable
              onPress={() => setFullScreenImage(item.imageUrl)}
              onLongPress={() => selectReply(item)}
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.messageImage}
              />
            </Pressable>
          ) : (
            <Text
              style={[
                styles.messageText,
                !mine && styles.otherMessageText,
              ]}
            >
              {item.text}
            </Text>
          )}

          {mine && (
            <Text style={styles.messageStatus}>
              {item.status === "delivered"
                ? "✓✓ Delivered"
                : "✓ Sent"}
            </Text>
          )}
        </Pressable>
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

          {/* Reply preview above the message input */}
          {selectedReply && (
            <View style={styles.replyComposer}>
              <View style={styles.replyComposerDetails}>
                <Text style={styles.replyAuthor}>
                  Replying to {selectedReply.sender?.name || "ORBIT User"}
                </Text>

                <Text style={styles.replyContent} numberOfLines={2}>
                  {getReplyPreview(selectedReply)}
                </Text>
              </View>

              <Pressable
                style={styles.replyCancelButton}
                onPress={cancelReply}
              >
                <Text style={styles.replyCancelText}>×</Text>
              </Pressable>
            </View>
          )}

          {/* Selected image preview */}
          {selectedImage && (
            <ImagePreview
              image={selectedImage}
              onCancel={cancelImagePreview}
              onSend={handleImageSend}
              theme={theme}
            />
          )}

          {/* Message input */}
          <View style={styles.inputContainer}>
            <Pressable
              style={styles.attachmentButton}
              onPress={pickImage}
            >
              <Text style={styles.attachmentButtonText}>+</Text>
            </Pressable>

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

        {/* Full-screen image viewer */}
        <Modal
          visible={fullScreenImage !== null}
          transparent={false}
          animationType="fade"
          onRequestClose={() => setFullScreenImage(null)}
        >
          <View style={styles.fullScreenContainer}>
            <TouchableOpacity
              style={styles.closeImageButton}
              onPress={() => setFullScreenImage(null)}
            >
              <Text style={styles.closeImageText}>×</Text>
            </TouchableOpacity>

            {fullScreenImage && (
              <Image
                source={{ uri: fullScreenImage }}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
            )}
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </OrbitalBackground>
  );
}
