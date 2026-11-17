
import { useState, useEffect, useContext } from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";

import * as SecureStore from "expo-secure-store";

import OrbitalBackground from "../components/OrbitalBackground";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { apiRequest } from "../services/api";

export default function DiscoverScreen() {
  const { theme } = useContext(ThemeContext);
  const { user: currentUser } = useContext(AuthContext);

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch registered users from the backend
  async function fetchUsers() {
    try {
      setLoading(true);
      setError("");

      const token = await SecureStore.getItemAsync("userToken");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const result = await apiRequest(
        "/api/users",
        "GET",
        null,
        token
      );

      setUsers(result.users);
    } catch (error) {
      setError(error.message || "Unable to fetch users.");
    } finally {
      setLoading(false);
    }
  }

  // Fetch users when Discover screen opens
  useEffect(() => {
    fetchUsers();
  }, []);

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

    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 25,
    },

    errorText: {
      color: theme.text,
      textAlign: "center",
      fontSize: 14,
      marginBottom: 18,
    },

    retryButton: {
      backgroundColor: theme.button,
      borderRadius: 10,
      paddingHorizontal: 25,
      paddingVertical: 12,
    },

    retryButtonText: {
      color: theme.buttonText,
      fontWeight: "bold",
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
    const displayUsername = item.username.startsWith("@")
      ? item.username
      : `@${item.username}`;

    return (
      <View style={styles.userItem}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* User details */}
        <View style={styles.userDetails}>
          <Text style={styles.userName} numberOfLines={1}>
            {item.name}
          </Text>

          <Text style={styles.username}>
            {displayUsername}
          </Text>

          <Text style={styles.status}>
            Status unavailable
          </Text>
        </View>

        {/* Message button */}
        <Pressable
          style={styles.messageButton}
          onPress={() => {
            // Chat functionality will be implemented later
          }}
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

        {/* Loading */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator
              size="large"
              color={theme.highlight}
            />

            <Text style={[styles.emptyText, { marginTop: 15 }]}>
              Finding people...
            </Text>
          </View>
        ) : error ? (
          /* Error */
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>
              {error}
            </Text>

            <Pressable
              style={styles.retryButton}
              onPress={fetchUsers}
            >
              <Text style={styles.retryButtonText}>
                Try Again
              </Text>
            </Pressable>
          </View>
        ) : (
          /* User list */
          <FlatList
            data={filteredUsers}
            renderItem={renderUser}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No users found.
              </Text>
            }
          />
        )}
      </View>
    </OrbitalBackground>
  );
}
