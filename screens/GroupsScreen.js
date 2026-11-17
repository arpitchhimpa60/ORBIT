
import { useState, useEffect } from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';

import OrbitalBackground from '../components/OrbitalBackground';

// Temporary sample groups
const initialGroups = [
  {
    id: '1',
    name: 'Project Team',
    members: 4,
    message: 'Rahul: Meeting at 5 PM?',
    time: '10:45 AM',
    unread: 2,
  },
  {
    id: '2',
    name: 'College Friends',
    members: 8,
    message: 'Ketan: Check out this picture!',
    time: 'Yesterday',
    unread: 0,
  },
  {
    id: '3',
    name: 'Hackathon Team',
    members: 5,
    message: 'You: I have pushed the latest code.',
    time: 'Yesterday',
    unread: 3,
  },
  {
    id: '4',
    name: 'Weekend Plans',
    members: 6,
    message: 'Ananya: Where are we going?',
    time: 'Monday',
    unread: 0,
  },
  {
    id: '5',
    name: 'DSA Discussion',
    members: 12,
    message: 'Arnav: Solution for question 3?',
    time: 'Sunday',
    unread: 0,
  },
];

export default function GroupsScreen({ navigation, route }) {
  const [groups, setGroups] = useState(initialGroups);
  const [search, setSearch] = useState('');

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
            'Group conversation will be implemented later.'
          )
        }
      >
        {/* Group avatar */}
        <View style={styles.groupAvatar}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0)}
          </Text>
        </View>

        {/* Group information */}
        <View style={styles.groupDetails}>
          <Text style={styles.groupName}>
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
            placeholderTextColor="#BDB5E8"
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
          onPress={() => navigation.navigate('CreateGroup')}
        >
          <Text style={styles.createButtonText}>+</Text>
        </Pressable>

      </View>
    </OrbitalBackground>
  );
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
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
  },

  description: {
    color: '#D8D2FF',
    fontSize: 13,
    marginTop: 6,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#40318C',
    borderWidth: 1,
    borderColor: '#7669D8',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 25,
  },

  searchIcon: {
    color: '#D8D2FF',
    fontSize: 25,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 14,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
  },

  groupCount: {
    color: '#D8D2FF',
    fontSize: 12,
  },

  listContent: {
    paddingBottom: 100,
  },

  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },

  groupAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#7669D8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: 'bold',
  },

  groupDetails: {
    flex: 1,
  },

  groupName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  memberCount: {
    color: '#BDB5E8',
    fontSize: 11,
    marginTop: 3,
  },

  lastMessage: {
    color: '#D8D2FF',
    fontSize: 12,
    marginTop: 5,
  },

  rightSection: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },

  time: {
    color: '#BDB5E8',
    fontSize: 10,
  },

  unreadBadge: {
    backgroundColor: '#FFFFFF',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginTop: 9,
  },

  unreadText: {
    color: '#302078',
    fontSize: 11,
    fontWeight: 'bold',
  },

  emptyText: {
    color: '#D8D2FF',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },

  createButton: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  createButtonText: {
    color: '#302078',
    fontSize: 34,
    fontWeight: '400',
    lineHeight: 38,
  },
});
