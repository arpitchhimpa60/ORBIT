
import { useState, useEffect, useContext } from "react";

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

// Temporary sample groups
const initialGroups = [
  {
    id: "1",
    name: "Project Team",
    members: 4,
    message: "Rahul: Meeting at 5 PM?",
    time: "10:45 AM",
    unread: 2,
  },
  {
    id: "2",
    name: "College Friends",
    members: 8,
    message: "Ketan: Check out this picture!",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: "3",
    name: "Hackathon Team",
    members: 5,
    message: "You: I have pushed the latest code.",
    time: "Yesterday",
    unread: 3,
  },
  {
    id: "4",
    name: "Weekend Plans",
    members: 6,
    message: "Ananya: Where are we going?",
    time: "Monday",
    unread: 0,
  },
  {
    id: "5",
    name: "DSA Discussion",
    members: 12,
    message: "Arnav: Solution for question 3?",
    time: "Sunday",
    unread: 0,
  },
];

export default function GroupsScreen({ navigation, route }) {
  const [groups, setGroups] = useState(initialGroups);
  const [search, setSearch] = useState("");

  // Get global theme
  const { theme } = useContext(ThemeContext);

  // Receive a newly created group
  const newGroup = route.params?.newGroup;

  useEffect(() => {
    if (newGroup) {
      setGroups((previousGroups) => {
        // Prevent adding the same group twice
        const alreadyExists = previousGroups.some(
          (group) => group.id === newGroup.id
        );

        if (alreadyExists) {
          return previousGroups;
        }

        // Add new group at the beginning
        return [newGroup, ...previousGroups];
      });

      // Clear the navigation parameter
      navigation.setParams({ newGroup: undefined });
    }
  }, [newGroup, navigation]);

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
    },

    groupItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 16,
      padding: 14,
      marginBottom: 12,
    },

    groupAvatar: {
      width: 55,
      height: 55,
      borderRadius: 16,
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

    groupDetails: {
      flex: 1,
    },

    groupName: {
      color: theme.text,
      fontSize: 15,
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

  // Search groups by name
  const filteredGroups = groups.filter((item) => {
    return item.name.toLowerCase().includes(search.toLowerCase());
  });

  // Display each group
  function renderGroup({ item }) {
    return (
      <Pressable
        style={styles.groupItem}
        onPress={() =>
          Alert.alert(
            item.name,
            "Group conversation will be implemented later."
          )
        }
      >
        {/* Group avatar */}
        <View style={styles.groupAvatar}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Group information */}
        <View style={styles.groupDetails}>
          <Text style={styles.groupName} numberOfLines={1}>
            {item.name}
          </Text>

          <Text style={styles.memberCount}>
            {item.members} members
          </Text>

          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.message}
          </Text>
        </View>

        {/* Time and unread count */}
        <View style={styles.rightSection}>
          <Text style={styles.time}>
            {item.time}
          </Text>

          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {item.unread}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  }

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

        {/* Group list */}
        <FlatList
          data={filteredGroups}
          renderItem={renderGroup}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No groups found.
            </Text>
          }
        />

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
