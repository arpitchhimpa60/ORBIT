
import { useState, useContext } from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import OrbitalBackground from "../components/OrbitalBackground";
import { ThemeContext } from "../context/ThemeContext";

// Temporary sample users
const users = [
  { id: "1", name: "Rahul Sharma", username: "@rahul", online: true },
  { id: "2", name: "Ananya Singh", username: "@ananya", online: true },
  { id: "3", name: "Ketan Agarwal", username: "@ketan", online: false },
  { id: "4", name: "Arnav Goyal", username: "@arnav", online: false },
  { id: "5", name: "Asmi Mishra", username: "@asmi", online: true },
  { id: "6", name: "Priya Verma", username: "@priya", online: false },
];

export default function CreateGroupScreen({ navigation }) {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Get global theme
  const { theme } = useContext(ThemeContext);

  // Theme-aware styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 15,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 25,
    },

    backButton: {
      width: 44,
      height: 44,
      borderRadius: 13,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 13,
    },

    backText: {
      color: theme.text,
      fontSize: 32,
      lineHeight: 36,
    },

    heading: {
      color: theme.text,
      fontSize: 26,
      fontWeight: "bold",
    },

    description: {
      color: theme.secondaryText,
      fontSize: 13,
      marginTop: 4,
    },

    sectionTitle: {
      color: theme.text,
      fontSize: 17,
      fontWeight: "bold",
      marginBottom: 10,
    },

    input: {
      backgroundColor: theme.input,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 13,
      paddingHorizontal: 15,
      paddingVertical: 14,
      color: theme.text,
      fontSize: 14,
      marginBottom: 22,
    },

    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    memberCount: {
      color: theme.secondaryText,
      fontSize: 12,
      marginBottom: 10,
    },

    selectedContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 22,
    },

    memberChip: {
      backgroundColor: theme.primary,
      borderRadius: 18,
      paddingHorizontal: 12,
      paddingVertical: 9,
      marginRight: 8,
      marginBottom: 8,
    },

    memberChipText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "600",
    },

    emptySelection: {
      color: theme.secondaryText,
      fontSize: 13,
      marginBottom: 22,
    },

    userItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 15,
      padding: 12,
      marginBottom: 10,
    },

    avatar: {
      width: 46,
      height: 46,
      borderRadius: 23,
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

    userDetails: {
      flex: 1,
    },

    userName: {
      color: theme.text,
      fontSize: 14,
      fontWeight: "bold",
    },

    username: {
      color: theme.secondaryText,
      fontSize: 12,
      marginTop: 4,
    },

    selectButton: {
      backgroundColor: theme.button,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderWidth: 1,
      borderColor: theme.border,
    },

    selectedButton: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },

    selectButtonText: {
      color: theme.buttonText,
      fontSize: 12,
      fontWeight: "bold",
    },

    selectedButtonText: {
      color: "#FFFFFF",
    },

    createButton: {
      backgroundColor: theme.button,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 25,
      marginBottom: 30,
      borderWidth: 1,
      borderColor: theme.border,
    },

    createButtonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  // Filter users by name or username
  const filteredUsers = users.filter((item) => {
    return (
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.username.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Select or remove a member
  function toggleUser(user) {
    const alreadySelected = selectedUsers.some(
      (item) => item.id === user.id
    );

    if (alreadySelected) {
      setSelectedUsers(
        selectedUsers.filter((item) => item.id !== user.id)
      );
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  }

  // Create group after validation
  function handleCreateGroup() {
    if (groupName.trim() === "") {
      Alert.alert("Group name required", "Please enter a group name.");
      return;
    }

    if (selectedUsers.length === 0) {
      Alert.alert(
        "Add members",
        "Please select at least one other member."
      );
      return;
    }

    // Create a new group object
    const newGroup = {
      id: Date.now().toString(),
      name: groupName.trim(),
      members: selectedUsers.length + 1,
      message: "Group created",
      time: "Just now",
      unread: 0,
    };

    // Return to Groups and pass the new group
    navigation.navigate("MainTabs", {
      screen: "Groups",
      params: {
        newGroup: newGroup,
      },
    });
  }

  // Display a user in the list
  function renderUser({ item }) {
    const isSelected = selectedUsers.some(
      (user) => user.id === item.id
    );

    return (
      <Pressable
        style={styles.userItem}
        onPress={() => toggleUser(item)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.username}>{item.username}</Text>
        </View>

        <View
          style={[
            styles.selectButton,
            isSelected && styles.selectedButton,
          ]}
        >
          <Text
            style={[
              styles.selectButtonText,
              isSelected && styles.selectedButtonText,
            ]}
          >
            {isSelected ? "Selected" : "Add"}
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <OrbitalBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Text style={styles.backText}>‹</Text>
            </Pressable>

            <View>
              <Text style={styles.heading}>Create Group</Text>

              <Text style={styles.description}>
                Bring people together.
              </Text>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Group name */}
            <Text style={styles.sectionTitle}>Group name</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter group name"
              placeholderTextColor={theme.placeholder}
              value={groupName}
              onChangeText={setGroupName}
              maxLength={40}
            />

            {/* Selected members */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Selected members
              </Text>

              <Text style={styles.memberCount}>
                {selectedUsers.length} selected
              </Text>
            </View>

            {selectedUsers.length > 0 ? (
              <View style={styles.selectedContainer}>
                {selectedUsers.map((user) => (
                  <Pressable
                    key={user.id}
                    style={styles.memberChip}
                    onPress={() => toggleUser(user)}
                  >
                    <Text style={styles.memberChipText}>
                      {user.name}  ×
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : (
              <Text style={styles.emptySelection}>
                No members selected yet.
              </Text>
            )}

            {/* Search users */}
            <Text style={styles.sectionTitle}>Add members</Text>

            <TextInput
              style={styles.input}
              placeholder="Search by name or username..."
              placeholderTextColor={theme.placeholder}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
            />

            {/* User list */}
            <FlatList
              data={filteredUsers}
              renderItem={renderUser}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={styles.emptySelection}>
                  No users found.
                </Text>
              }
            />

            {/* Create button */}
            <Pressable
              style={styles.createButton}
              onPress={handleCreateGroup}
            >
              <Text style={styles.createButtonText}>
                Create Group
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </OrbitalBackground>
  );
}
