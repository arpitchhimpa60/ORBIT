
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

// Temporary sample users
const users = [
  {
    id: "1",
    name: "Rahul Sharma",
    username: "@rahul",
    online: true,
  },
  {
    id: "2",
    name: "Ananya Singh",
    username: "@ananya",
    online: true,
  },
  {
    id: "3",
    name: "Ketan Agarwal",
    username: "@ketan",
    online: false,
  },
  {
    id: "4",
    name: "Arnav Goyal",
    username: "@arnav",
    online: false,
  },
  {
    id: "5",
    name: "Asmi Mishra",
    username: "@asmi",
    online: true,
  },
  {
    id: "6",
    name: "Priya Verma",
    username: "@priya",
    online: false,
  },
];

export default function DiscoverScreen() {
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

    userCount: {
      color: theme.secondaryText,
      fontSize: 12,
    },

    listContent: {
      paddingBottom: 25,
    },

    userItem: {
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

    userDetails: {
      flex: 1,
    },

    userName: {
      color: theme.text,
      fontSize: 15,
      fontWeight: "bold",
    },

    username: {
      color: theme.secondaryText,
      fontSize: 12,
      marginTop: 4,
    },

    status: {
      color: theme.placeholder,
      fontSize: 11,
      marginTop: 4,
    },

    messageButton: {
      backgroundColor: theme.button,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },

    messageButtonText: {
      color: theme.buttonText,
      fontSize: 12,
      fontWeight: "bold",
    },

    emptyText: {
      color: theme.secondaryText,
      textAlign: "center",
      marginTop: 40,
      fontSize: 14,
    },
  });

  // Search users by name or username
  const filteredUsers = users.filter((item) => {
    return (
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.username.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Display each user
  function renderUser({ item }) {
    return (
      <View style={styles.userItem}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>

          {item.online && <View style={styles.onlineIndicator} />}
        </View>

        {/* User details */}
        <View style={styles.userDetails}>
          <Text style={styles.userName} numberOfLines={1}>
            {item.name}
          </Text>

          <Text style={styles.username}>
            {item.username}
          </Text>

          <Text style={styles.status}>
            {item.online ? "Online" : "Offline"}
          </Text>
        </View>

        {/* Message button */}
        <Pressable
          style={styles.messageButton}
          onPress={() =>
            Alert.alert(
              "Start Chat",
              `Starting a conversation with ${item.name} will be added later.`
            )
          }
        >
          <Text style={styles.messageButtonText}>
            Message
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <OrbitalBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>Discover</Text>

          <Text style={styles.description}>
            Find people and make connections.
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or username..."
            placeholderTextColor={theme.placeholder}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />
        </View>

        {/* Results heading */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            People
          </Text>

          <Text style={styles.userCount}>
            {filteredUsers.length} users
          </Text>
        </View>

        {/* User list */}
        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No users found.
            </Text>
          }
        />
      </View>
    </OrbitalBackground>
  );
}
