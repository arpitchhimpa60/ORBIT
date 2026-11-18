
import { useState, useContext, useCallback } from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

import OrbitalBackground from "../components/OrbitalBackground";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { apiRequest } from "../services/api";
import { socket } from "../services/socket";

export default function ChatsScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  // Get the logged-in user's ID
  const currentUserId = user?._id || user?.id;

  // Fetch conversations whenever the Chats screen is opened
  const fetchConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const token = await SecureStore.getItemAsync("userToken");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const result = await apiRequest(
        "/api/conversations",
        "GET",
        null,
        token
      );

      setConversations(result.conversations);
    } catch (error) {
      console.log("Fetch conversations error:", error.message);
      setError(error.message || "Unable to load conversations.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Run the API request whenever this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchConversations();

      // Listen for new incoming messages while this screen is active
      function handleNewMessage(newMessage) {
        const senderId = newMessage.sender?._id || newMessage.sender;

        // Do not count messages sent by the logged-in user
        if (String(senderId) === String(currentUserId)) {
          return;
        }

        const conversationId =
          newMessage.conversation?._id || newMessage.conversation;

        setConversations((previousConversations) =>
          previousConversations.map((conversation) => {
            if (String(conversation._id) !== String(conversationId)) {
              return conversation;
            }

            return {
              ...conversation,
              unreadCount: (conversation.unreadCount || 0) + 1,
            };
          })
        );
      }

      socket.on("newMessage", handleNewMessage);

      return () => {
        socket.off("newMessage", handleNewMessage);
      };
    }, [fetchConversations, currentUserId])
  );

  // Find the other participant in each private conversation
  const chatList = conversations
    .map((conversation) => {
      const otherUser = conversation.participants.find(
        (participant) =>
          String(participant._id || participant.id) !==
          String(currentUserId)
      );

      if (!otherUser) {
        return null;
      }

      return {
        id: conversation._id,
        name: otherUser.name,
        username: otherUser.username,
        profilePicture: otherUser.profilePicture,
        unreadCount: conversation.unreadCount || 0,
      };
    })
    .filter((item) => item !== null);

  // Filter conversations using search text
  const filteredConversations = chatList.filter((item) => {
    return (
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.username.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Theme-aware styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 25,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 25,
    },

    logo: {
      color: theme.text,
      fontSize: 30,
      fontWeight: "bold",
      letterSpacing: 3,
    },

    subtitle: {
      color: theme.secondaryText,
      fontSize: 13,
      marginTop: 5,
    },

    profileButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.card,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: theme.highlight,
      elevation: 4,
      zIndex: 2,
    },

    profileButtonText: {
      color: theme.text,
      fontSize: 20,
      fontWeight: "bold",
    },

    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.input,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14,
      paddingHorizontal: 15,
      marginBottom: 25,
    },

    searchIcon: {
      color: theme.secondaryText,
      fontSize: 25,
      marginRight: 10,
    },

    searchInput: {
      flex: 1,
      paddingVertical: 15,
      color: theme.text,
      fontSize: 14,
    },

    clearButton: {
      width: 30,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 5,
    },

    clearButtonText: {
      color: theme.secondaryText,
      fontSize: 22,
      fontWeight: "bold",
    },

    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },

    sectionTitle: {
      color: theme.text,
      fontSize: 19,
      fontWeight: "bold",
    },

    chatCount: {
      color: theme.secondaryText,
      fontSize: 12,
    },

    listContent: {
      paddingBottom: 130,
      flexGrow: 1,
    },

    chatItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 16,
      padding: 14,
      marginBottom: 12,
    },

    avatarContainer: {
      width: 55,
      height: 55,
      borderRadius: 28,
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 13,
    },

    avatarText: {
      color: "#FFFFFF",
      fontSize: 22,
      fontWeight: "bold",
    },

    chatDetails: {
      flex: 1,
    },

    chatName: {
      color: theme.text,
      fontSize: 15,
      fontWeight: "bold",
    },

    chatUsername: {
      color: theme.secondaryText,
      fontSize: 13,
      marginTop: 6,
    },

    lastMessage: {
      color: theme.secondaryText,
      fontSize: 12,
      marginTop: 5,
    },

    unreadBadge: {
      minWidth: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.highlight,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 6,
      marginLeft: 10,
    },

    unreadBadgeText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "bold",
    },

    emptyText: {
      color: theme.secondaryText,
      textAlign: "center",
      marginTop: 40,
      fontSize: 14,
    },

    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    errorText: {
      color: theme.secondaryText,
      textAlign: "center",
      marginTop: 40,
      fontSize: 14,
    },

    retryButton: {
      alignSelf: "center",
      marginTop: 15,
      backgroundColor: theme.button,
      paddingHorizontal: 22,
      paddingVertical: 10,
      borderRadius: 12,
    },

    retryButtonText: {
      color: theme.buttonText,
      fontWeight: "bold",
    },

    newChatButton: {
      position: "absolute",
      bottom: 20,
      right: 20,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.button,
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.border,
    },

    newChatButtonText: {
      color: theme.buttonText,
      fontSize: 36,
      fontWeight: "400",
      lineHeight: 40,
    },
  });

  // Display each conversation
  function renderConversation({ item }) {
    return (
      <Pressable
        style={styles.chatItem}
        onPress={() =>
          navigation.navigate("PrivateChat", {
            conversationId: item.id,
            otherUser: {
              name: item.name,
              username: item.username,
            },
          })
        }
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Conversation details */}
        <View style={styles.chatDetails}>
          <Text style={styles.chatName} numberOfLines={1}>
            {item.name}
          </Text>

          <Text style={styles.chatUsername} numberOfLines={1}>
            @{item.username}
          </Text>

          <Text style={styles.lastMessage}>
            Start a conversation
          </Text>
        </View>

        {/* Unread message count */}
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>
              {item.unreadCount > 99 ? "99+" : item.unreadCount}
            </Text>
          </View>
        )}
      </Pressable>
    );
  }

  return (
    <OrbitalBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>ORBIT</Text>
            <Text style={styles.subtitle}>Your conversations</Text>
          </View>

          <Pressable
            style={styles.profileButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.profileButtonText}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </Pressable>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor={theme.placeholder}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />

          {/* Clear Search */}
          {search.length > 0 && (
            <Pressable
              style={styles.clearButton}
              onPress={() => setSearch("")}
            >
              <Text style={styles.clearButtonText}>×</Text>
            </Pressable>
          )}
        </View>

        {/* Conversation heading */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Chats</Text>

          <Text style={styles.chatCount}>
            {filteredConversations.length} chats
          </Text>
        </View>

        {/* Loading state */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.highlight} />
          </View>
        ) : error ? (
          /* Error state */
          <View>
            <Text style={styles.errorText}>{error}</Text>

            <Pressable
              style={styles.retryButton}
              onPress={fetchConversations}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </Pressable>
          </View>
        ) : (
          /* Conversation list */
          <FlatList
            data={filteredConversations}
            renderItem={renderConversation}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {search.length > 0
                  ? "No conversations match your search."
                  : "No conversations yet. Start a new chat!"}
              </Text>
            }
          />
        )}

        {/* New Chat Button */}
        <Pressable
          style={styles.newChatButton}
          onPress={() => navigation.navigate("Discover")}
        >
          <Text style={styles.newChatButtonText}>+</Text>
        </Pressable>
      </View>
    </OrbitalBackground>
  );
}
