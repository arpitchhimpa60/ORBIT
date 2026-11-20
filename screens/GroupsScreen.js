
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
import GroupAvatar from "../components/GroupAvatar";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { apiRequest } from "../services/api";

export default function GroupsScreen({ navigation }) {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const currentUserId = user?._id || user?.id;

  // Fetch groups whenever the screen is opened
  const fetchGroups = useCallback(async () => {
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

      // Keep only group conversations
      const groupConversations = result.conversations.filter(
        (conversation) => conversation.type === "group"
      );

      setGroups(groupConversations);
    } catch (error) {
      console.log("Fetch groups error:", error.message);
      setError(error.message || "Unable to load groups.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh groups whenever this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [fetchGroups])
  );

  // Format the message time
  function formatMessageTime(dateValue) {
    if (!dateValue) {
      return "";
    }

    const messageDate = new Date(dateValue);
    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
    }

    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    if (messageDate.getFullYear() === today.getFullYear()) {
      return messageDate.toLocaleDateString([], {
        weekday: "long",
      });
    }

    return messageDate.toLocaleDateString();
  }

  // Search groups by name
  const filteredGroups = groups.filter((item) => {
    return item.groupName
      ?.toLowerCase()
      .includes(search.toLowerCase());
  });

  // Display each group
  function renderGroup({ item }) {
    const lastMessage = item.lastMessage;

    const senderId =
      lastMessage?.sender?._id || lastMessage?.sender;

    const senderName = lastMessage
      ? String(senderId) === String(currentUserId)
        ? "You"
        : lastMessage.sender?.name || "Member"
      : "";

    const messagePreview = lastMessage
      ? `${senderName}: ${lastMessage.type === "image" ? "Photo" : lastMessage.text || "Message"}`
      : "No messages yet";

    return (
      <Pressable
        style={styles.groupItem}
        onPress={() =>
          navigation.navigate("GroupChat", {
            conversationId: item._id,
            groupName: item.groupName,
          })
        }
      >
        {/* Group avatar */}
        <GroupAvatar name={item.groupName} size={55} theme={theme} />

        {/* Group information */}
        <View style={styles.groupDetails}>
          <Text style={styles.groupName} numberOfLines={1}>
            {item.groupName}
          </Text>

          <Text style={styles.memberCount}>
            {item.participants.length} members
          </Text>

          <Text style={styles.lastMessage} numberOfLines={1}>
            {messagePreview}
          </Text>
        </View>

        {/* Time and unread count */}
        <View style={styles.rightSection}>
          <Text style={styles.time}>
            {formatMessageTime(lastMessage?.createdAt)}
          </Text>

          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {item.unreadCount > 99 ? "99+" : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  }

  // Theme-aware styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 25,
    },

    header: {
      marginBottom: 25,
    },

    heading: {
      color: theme.text,
      fontSize: 30,
      fontWeight: "bold",
    },

    description: {
      color: theme.secondaryText,
      fontSize: 13,
      marginTop: 6,
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

    groupCount: {
      color: theme.secondaryText,
      fontSize: 12,
    },

    listContent: {
      paddingBottom: 100,
      flexGrow: 1,
    },

    groupItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 16,
      padding: 15,
      marginBottom: 10,
    },

    groupDetails: {
      flex: 1,
    },

    groupName: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "bold",
    },

    memberCount: {
      color: theme.placeholder,
      fontSize: 11,
      marginTop: 4,
    },

    lastMessage: {
      color: theme.secondaryText,
      fontSize: 12,
      marginTop: 6,
    },

    rightSection: {
      alignItems: "flex-end",
      marginLeft: 8,
    },

    time: {
      color: theme.placeholder,
      fontSize: 11,
    },

    unreadBadge: {
      backgroundColor: theme.highlight,
      minWidth: 22,
      height: 22,
      borderRadius: 11,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 6,
      marginTop: 9,
    },

    unreadText: {
      color: "#FFFFFF",
      fontSize: 11,
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

    createButton: {
      position: "absolute",
      bottom: 25,
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

    createButtonText: {
      color: theme.buttonText,
      fontSize: 36,
      fontWeight: "400",
      lineHeight: 40,
    },
  });

  return (
    <OrbitalBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>Groups</Text>

          <Text style={styles.description}>
            Your communities, all in one place.
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search groups..."
            placeholderTextColor={theme.placeholder}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />
        </View>

        {/* Group count */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Your Groups
          </Text>

          <Text style={styles.groupCount}>
            {filteredGroups.length} groups
          </Text>
        </View>

        {/* Loading state */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={theme.highlight}
            />
          </View>
        ) : error ? (
          <View>
            <Text style={styles.errorText}>{error}</Text>

            <Pressable
              style={styles.retryButton}
              onPress={fetchGroups}
            >
              <Text style={styles.retryButtonText}>
                Try Again
              </Text>
            </Pressable>
          </View>
        ) : (
          /* Group list */
          <FlatList
            data={filteredGroups}
            renderItem={renderGroup}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {search.length > 0
                  ? "No groups match your search."
                  : "No groups yet. Create your first group!"}
              </Text>
            }
          />
        )}

        {/* Create Group Button */}
        <Pressable
          style={styles.createButton}
          onPress={() => navigation.navigate("CreateGroup")}
        >
          <Text style={styles.createButtonText}>+</Text>
        </Pressable>
      </View>
    </OrbitalBackground>
  );
}
