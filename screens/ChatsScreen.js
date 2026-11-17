
import { useState, useContext } from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from "react-native";

import OrbitalBackground from "../components/OrbitalBackground";
import { ThemeContext } from "../context/ThemeContext";

// Temporary conversation data
const conversations = [
  {
    id: "1",
    name: "Rahul Sharma",
    username: "@rahul",
    message: "Hey! How are you?",
    time: "9:15 PM",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Ananya Singh",
    username: "@ananya",
    message: "See you tomorrow!",
    time: "8:45 PM",
    unread: 0,
    online: true,
  },
  {
    id: "3",
    name: "Ketan Agarwal",
    username: "@ketan",
    message: "Project update shared.",
    time: "7:30 PM",
    unread: 1,
    online: false,
  },
  {
    id: "4",
    name: "Arnav Goyal",
    username: "@arnav",
    message: "Thanks for your help!",
    time: "6:20 PM",
    unread: 0,
    online: false,
  },
  {
    id: "5",
    name: "Asmi Mishra",
    username: "@asmi",
    message: "That sounds great!",
    time: "Yesterday",
    unread: 0,
    online: true,
  },
];

export default function ChatsScreen({ navigation }) {
  const [search, setSearch] = useState("");

  // Get global theme
  const { theme } = useContext(ThemeContext);

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
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: theme.highlight,
    },

    profileButtonText: {
      color: "#FFFFFF",
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
      paddingBottom: 100,
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

    onlineIndicator: {
      position: "absolute",
      width: 13,
      height: 13,
      borderRadius: 7,
      backgroundColor: theme.success,
      bottom: 0,
      right: 0,
      borderWidth: 2,
      borderColor: theme.card,
    },

    chatDetails: {
      flex: 1,
    },

    chatTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    chatName: {
      color: theme.text,
      fontSize: 15,
      fontWeight: "bold",
      flex: 1,
      marginRight: 8,
    },

    chatTime: {
      color: theme.placeholder,
      fontSize: 11,
    },

    chatBottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 7,
    },

    lastMessage: {
      color: theme.secondaryText,
      fontSize: 13,
      flex: 1,
      marginRight: 8,
    },

    unreadBadge: {
      backgroundColor: theme.highlight,
      minWidth: 22,
      height: 22,
      borderRadius: 11,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 6,
    },

    unreadText: {
      color: theme.buttonText,
      fontSize: 11,
      fontWeight: "bold",
    },

    emptyText: {
      color: theme.secondaryText,
      textAlign: "center",
      marginTop: 40,
      fontSize: 14,
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

  // Filter conversations using search text
  const filteredConversations = conversations.filter((item) => {
    return (
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.username.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Display each conversation
  function renderConversation({ item }) {
    return (
      <Pressable
        style={styles.chatItem}
        onPress={() =>
          Alert.alert("Chat", `Chat with ${item.name} will be added later.`)
        }
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>

          {item.online && <View style={styles.onlineIndicator} />}
        </View>

        {/* Conversation details */}
        <View style={styles.chatDetails}>
          <View style={styles.chatTopRow}>
            <Text style={styles.chatName} numberOfLines={1}>
              {item.name}
            </Text>

            <Text style={styles.chatTime}>{item.time}</Text>
          </View>

          <View style={styles.chatBottomRow}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.message}
            </Text>

            {item.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unread}</Text>
              </View>
            )}
          </View>
        </View>
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
            <Text style={styles.profileButtonText}>A</Text>
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
        </View>

        {/* Conversation heading */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Chats</Text>

          <Text style={styles.chatCount}>
            {filteredConversations.length} chats
          </Text>
        </View>

        {/* Conversation list */}
        <FlatList
          data={filteredConversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No conversations found.</Text>
          }
        />

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
