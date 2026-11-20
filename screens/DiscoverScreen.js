
import { useState, useEffect, useContext } from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";

import * as SecureStore from "expo-secure-store";

import OrbitalBackground from "../components/OrbitalBackground";
import UserAvatar from "../components/UserAvatar";

import { ThemeContext } from "../context/ThemeContext";
import { apiRequest } from "../services/api";
import { socket } from "../services/socket";

export default function DiscoverScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startingChatId, setStartingChatId] = useState(null);

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

  // Update one user's online status
  function updateUserStatus(userId, isOnline, lastSeen = null) {
    setUsers((previousUsers) => {
      return previousUsers.map((user) => {
        if (user._id !== userId) {
          return user;
        }

        return {
          ...user,
          isOnline,
          lastSeen: lastSeen || user.lastSeen,
        };
      });
    });
  }

  // Update a user's profile information in the Discover list
  function updateUserProfile(updatedUser) {
    if (!updatedUser?._id) {
      return;
    }

    setUsers((previousUsers) =>
      previousUsers.map((user) => {
        if (user._id !== updatedUser._id) {
          return user;
        }

        return {
          ...user,
          ...updatedUser,
        };
      })
    );
  }

  // Fetch users and listen for socket events
  useEffect(() => {
    const initialFetch = setTimeout(() => fetchUsers(), 0);

    function handleUserOnline(data) {
      if (!data?.userId) {
        return;
      }

      updateUserStatus(data.userId, true);
    }

    function handleUserOffline(data) {
      if (!data?.userId) {
        return;
      }

      updateUserStatus(
        data.userId,
        false,
        data.lastSeen
      );
    }

    // Handle profile updates received from other users
    function handleProfileUpdated(data) {
      if (!data?.user) {
        return;
      }

      updateUserProfile(data.user);
    }

    // Refresh users when Socket.IO reconnects
    function handleSocketConnect() {
      fetchUsers();
    }

    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);
    socket.on("profileUpdated", handleProfileUpdated);
    socket.on("connect", handleSocketConnect);

    return () => {
      clearTimeout(initialFetch);
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);
      socket.off("profileUpdated", handleProfileUpdated);
      socket.off("connect", handleSocketConnect);
    };
  }, []);

  // Format the last seen date
  function formatLastSeen(lastSeen) {
    if (!lastSeen) {
      return "Last seen recently";
    }

    const date = new Date(lastSeen);

    if (isNaN(date.getTime())) {
      return "Last seen recently";
    }

    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) {
      return `Last seen today at ${time}`;
    }

    if (isYesterday) {
      return `Last seen yesterday at ${time}`;
    }

    const dateText = date.toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    return `Last seen ${dateText} at ${time}`;
  }

  // Start a private conversation with the selected user
  async function startPrivateChat(selectedUser) {
    if (startingChatId) {
      return;
    }

    try {
      setStartingChatId(selectedUser._id);

      const token = await SecureStore.getItemAsync("userToken");

      if (!token) {
        throw new Error("Please log in again.");
      }

      // Create a conversation or get the existing one
      const result = await apiRequest(
        "/api/conversations",
        "POST",
        {
          receiverId: selectedUser._id,
        },
        token
      );

      // Open the private chat screen
      navigation.navigate("PrivateChat", {
        conversationId: result.conversation._id,

        // Pass the complete user information
        otherUser: {
          _id: selectedUser._id,
          name: selectedUser.name,
          username: selectedUser.username,
          profilePicture: selectedUser.profilePicture || "",
          isOnline: selectedUser.isOnline,
          lastSeen: selectedUser.lastSeen,
        },
      });
    } catch (error) {
      console.log("Start private chat error:", error.message);

      Alert.alert(
        "Unable to open chat",
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setStartingChatId(null);
    }
  }

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
      marginBottom: 22,
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
      padding: 15,
      marginBottom: 10,
    },

    userDetails: {
      flex: 1,
      marginLeft: 13,
    },

    userName: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "bold",
    },

    username: {
      color: theme.secondaryText,
      fontSize: 12,
      marginTop: 4,
    },

    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
    },

    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },

    status: {
      color: theme.placeholder,
      fontSize: 11,
    },

    messageButton: {
      backgroundColor: theme.button,
      paddingHorizontal: 14,
      minHeight: 42,
      paddingVertical: 9,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: "center",
      alignItems: "center",
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
    const searchText = search.toLowerCase();

    return (
      item.name.toLowerCase().includes(searchText) ||
      item.username.toLowerCase().includes(searchText)
    );
  });

  // Display each user
  function renderUser({ item }) {
    const displayUsername = item.username.startsWith("@")
      ? item.username
      : `@${item.username}`;

    const isStartingChat = startingChatId === item._id;

    return (
      <View style={styles.userItem}>
        {/* User profile picture */}
        <UserAvatar
          user={item}
          size={55}
          theme={theme}
        />

        {/* User details */}
        <View style={styles.userDetails}>
          <Text style={styles.userName} numberOfLines={1}>
            {item.name}
          </Text>

          <Text style={styles.username}>
            {displayUsername}
          </Text>

          {/* Online / Offline status */}
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: item.isOnline
                    ? "#35C759"
                    : "#929292",
                },
              ]}
            />

            <Text style={styles.status} numberOfLines={1}>
              {item.isOnline
                ? "Online"
                : formatLastSeen(item.lastSeen)}
            </Text>
          </View>
        </View>

        {/* Message button */}
        <Pressable
          style={[
            styles.messageButton,
            startingChatId && { opacity: 0.6 },
          ]}
          disabled={startingChatId !== null}
          onPress={() => startPrivateChat(item)}
        >
          {isStartingChat ? (
            <ActivityIndicator
              size="small"
              color={theme.buttonText}
            />
          ) : (
            <Text style={styles.messageButtonText}>
              Message
            </Text>
          )}
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
