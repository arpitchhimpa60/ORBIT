import { useState } from "react";

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

  // Filter conversations using the search text
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
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>

          {item.online && <View style={styles.onlineIndicator} />}
        </View>

        {/* Conversation details */}
        <View style={styles.chatDetails}>
          <View style={styles.chatTopRow}>
            <Text style={styles.chatName}>{item.name}</Text>

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
            placeholderTextColor="#BDB5E8"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    letterSpacing: 3,
  },

  subtitle: {
    color: "#D8D2FF",
    fontSize: 13,
    marginTop: 4,
  },

  profileButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#7669D8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A99EFF",
  },

  profileButtonText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "bold",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#40318C",
    borderWidth: 1,
    borderColor: "#7669D8",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 25,
  },

  searchIcon: {
    color: "#D8D2FF",
    fontSize: 25,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 14,
    color: "#FFFFFF",
    fontSize: 14,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "bold",
  },

  chatCount: {
    color: "#D8D2FF",
    fontSize: 12,
  },

  listContent: {
    paddingBottom: 20,
  },

  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.12)",
  },

  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#7669D8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "bold",
  },

  onlineIndicator: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4ADE80",
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: "#302078",
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
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  chatTime: {
    color: "#BDB5E8",
    fontSize: 11,
  },

  chatBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 7,
  },

  lastMessage: {
    color: "#D8D2FF",
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },

  unreadBadge: {
    backgroundColor: "#A99EFF",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },

  unreadText: {
    color: "#302078",
    fontSize: 11,
    fontWeight: "bold",
  },

  emptyText: {
    color: "#D8D2FF",
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
  },
  newChatButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  newChatButtonText: {
    color: "#302078",
    fontSize: 34,
    fontWeight: "400",
    lineHeight: 38,
  },
});
