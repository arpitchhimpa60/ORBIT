
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

export default function GroupChatScreen({ navigation, route }) {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const { conversationId, groupName } = route.params;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedReply, setSelectedReply] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const [showAddMember, setShowAddMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [memberCount, setMemberCount] = useState(null);

  const flatListRef = useRef(null);
  const pendingStatusUpdates = useRef({});

  // Get logged-in user's ID
  function getCurrentUserId() {
    return user?._id || user?.id;
  }

  // Check whether the message belongs to the logged-in user
  function isMyMessage(message) {
    const senderId = message.sender?._id || message.sender;

    return String(senderId) === String(getCurrentUserId());
  }

  // Acknowledge messages received from other group members
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

  // Mark this group conversation as read
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
      console.log("Mark group as read error:", error.message);
    }
  }, [conversationId]);

  // Fetch group messages
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

      // Acknowledge messages received from other members
      result.messages.forEach((message) => {
        acknowledgeMessage(message);
      });
    } catch (error) {
      console.log("Fetch group messages error:", error.message);
      setError(error.message || "Unable to load group messages.");
    } finally {
      if (showLoader) {
        setIsLoading(false);
      }
    }
  }, [conversationId, user]);

  // Add a message without duplicates
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

  // Update message delivery status
  const updateMessageStatus = useCallback((statusUpdate) => {
    setMessages((previousMessages) => {
      const messageIndex = previousMessages.findIndex(
        (message) => message._id === statusUpdate.messageId
      );

      if (messageIndex === -1) {
        pendingStatusUpdates.current[statusUpdate.messageId] =
          statusUpdate;

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

  // Fetch the current group member count
  const fetchGroupDetails = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");

      if (!token) {
        return;
      }

      const result = await apiRequest(
        "/api/conversations",
        "GET",
        null,
        token
      );

      const currentGroup = result.conversations.find(
        (conversation) =>
          String(conversation._id) === String(conversationId)
      );

      if (currentGroup) {
        setMemberCount(currentGroup.participants.length);
      }
    } catch (error) {
      console.log("Fetch group details error:", error.message);
    }
  }, [conversationId]);

  // Add a new member to this group
  async function addGroupMember() {
    const email = memberEmail.trim().toLowerCase();

    if (!email) {
      Alert.alert(
        "Email required",
        "Enter the registered email address."
      );
      return;
    }

    if (isAddingMember) {
      return;
    }

    try {
      setIsAddingMember(true);

      const token = await SecureStore.getItemAsync("userToken");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const result = await apiRequest(
        `/api/conversations/${conversationId}/members`,
        "POST",
        { email: email },
        token
      );

      setMemberCount(result.conversation.participants.length);
      setMemberEmail("");
      setShowAddMember(false);

      Alert.alert("Success", "Member added to the group.");
    } catch (error) {
      Alert.alert(
        "Unable to add member",
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsAddingMember(false);
    }
  }

  // Listen for messages while this group is open
  useFocusEffect(
    useCallback(() => {
      fetchMessages();
      markConversationRead();
      fetchGroupDetails();

      function handleNewMessage(newMessage) {
        const messageConversationId =
          newMessage.conversation?._id || newMessage.conversation;

        if (
          String(messageConversationId) !== String(conversationId)
        ) {
          return;
        }

        addMessage(newMessage);

        acknowledgeMessage(newMessage);

        // Mark incoming group messages as read
        if (!isMyMessage(newMessage)) {
          markConversationRead();
        }
      }

      function handleMessageStatusUpdated(statusUpdate) {
        updateMessageStatus(statusUpdate);
      }

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
      fetchGroupDetails,
      addMessage,
      updateMessageStatus,
      markConversationRead,
      user,
    ])
  );

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

  // Open the device gallery and select an image
  async function pickImage() {
    const image = await ImagePicker();

    if (image) {
      setSelectedImage(image);
    }
  }

  // Close the image preview
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
      console.log("Send group image error:", error.message);

      Alert.alert(
        "Image not sent",
        error.message || "Unable to upload this image. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  }

  // Send a group message
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

      addMessage(result.newMessage);

      setText("");
      setSelectedReply(null);
    } catch (error) {
      console.log("Send group message error:", error.message);

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

    groupAvatar: {
      width: 42,
      height: 42,
      borderRadius: 13,
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },

    avatarText: {
      color: "#FFFFFF",
      fontSize: 19,
      fontWeight: "bold",
    },

    groupName: {
      color: theme.text,
      fontSize: 18,
      fontWeight: "bold",
    },

    groupSubtitle: {
      color: theme.secondaryText,
      fontSize: 12,
      marginTop: 4,
    },

    headerDetails: {
      flex: 1,
    },

    addMemberButton: {
      backgroundColor: theme.button,
      paddingHorizontal: 12,
      paddingVertical: 9,
      borderRadius: 10,
    },

    addMemberButtonText: {
      color: theme.buttonText,
      fontSize: 12,
      fontWeight: "bold",
    },

    addMemberContainer: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14,
      padding: 12,
      marginTop: 12,
      marginBottom: 12,
    },

    addMemberTitle: {
      color: theme.text,
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 10,
    },

    addMemberInput: {
      backgroundColor: theme.input,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 11,
      fontSize: 14,
      marginBottom: 10,
    },

    addMemberActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: 10,
    },

    cancelAddButton: {
      paddingHorizontal: 12,
      paddingVertical: 10,
    },

    cancelAddButtonText: {
      color: theme.secondaryText,
      fontSize: 12,
      fontWeight: "bold",
    },

    confirmAddButton: {
      backgroundColor: theme.button,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 10,
      minWidth: 85,
      alignItems: "center",
    },

    confirmAddButtonText: {
      color: theme.buttonText,
      fontSize: 12,
      fontWeight: "bold",
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

    senderName: {
      color: theme.highlight,
      fontSize: 11,
      fontWeight: "bold",
      marginBottom: 5,
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
      fontSize: 23,
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

    const senderName =
      item.sender?.name || "ORBIT User";

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
          {!mine && (
            <Text style={styles.senderName}>
              {senderName}
            </Text>
          )}

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
          {/* Group header */}
          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backText}>‹</Text>
            </Pressable>

            <View style={styles.groupAvatar}>
              <Text style={styles.avatarText}>
                {groupName.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={styles.headerDetails}>
              <Text style={styles.groupName} numberOfLines={1}>
                {groupName}
              </Text>

              <Text style={styles.groupSubtitle}>
                {memberCount === null
                  ? "Group conversation"
                  : `${memberCount} members`}
              </Text>
            </View>

            <Pressable
              style={styles.addMemberButton}
              onPress={() => setShowAddMember(!showAddMember)}
            >
              <Text style={styles.addMemberButtonText}>
                {showAddMember ? "Close" : "Add member"}
              </Text>
            </Pressable>
          </View>

          {/* Add member form */}
          {showAddMember && (
            <View style={styles.addMemberContainer}>
              <Text style={styles.addMemberTitle}>
                Add a member by email
              </Text>

              <TextInput
                style={styles.addMemberInput}
                placeholder="Enter registered email"
                placeholderTextColor={theme.placeholder}
                value={memberEmail}
                onChangeText={setMemberEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isAddingMember}
              />

              <View style={styles.addMemberActions}>
                <Pressable
                  style={styles.cancelAddButton}
                  onPress={() => {
                    setShowAddMember(false);
                    setMemberEmail("");
                  }}
                  disabled={isAddingMember}
                >
                  <Text style={styles.cancelAddButtonText}>
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.confirmAddButton}
                  onPress={addGroupMember}
                  disabled={isAddingMember}
                >
                  {isAddingMember ? (
                    <ActivityIndicator color={theme.buttonText} />
                  ) : (
                    <Text style={styles.confirmAddButtonText}>
                      Add
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          )}

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
                  No messages yet. Say hello to the group!
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
              placeholder="Message the group..."
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
