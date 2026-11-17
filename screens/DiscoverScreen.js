
import { useState } from 'react';

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

// Temporary sample users
const users = [
  {
    id: '1',
    name: 'Rahul Sharma',
    username: '@rahul',
    online: true,
  },
  {
    id: '2',
    name: 'Ananya Singh',
    username: '@ananya',
    online: true,
  },
  {
    id: '3',
    name: 'Ketan Agarwal',
    username: '@ketan',
    online: false,
  },
  {
    id: '4',
    name: 'Arnav Goyal',
    username: '@arnav',
    online: false,
  },
  {
    id: '5',
    name: 'Asmi Mishra',
    username: '@asmi',
    online: true,
  },
  {
    id: '6',
    name: 'Priya Verma',
    username: '@priya',
    online: false,
  },
];

export default function DiscoverScreen() {
  const [search, setSearch] = useState('');

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
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0)}
          </Text>

          {item.online && (
            <View style={styles.onlineIndicator} />
          )}
        </View>

        <View style={styles.userDetails}>
          <Text style={styles.userName}>
            {item.name}
          </Text>

          <Text style={styles.username}>
            {item.username}
          </Text>

          <Text style={styles.status}>
            {item.online ? 'Online' : 'Offline'}
          </Text>
        </View>

        <Pressable
          style={styles.messageButton}
          onPress={() =>
            Alert.alert(
              'Start Chat',
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
            placeholderTextColor="#BDB5E8"
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

  userCount: {
    color: '#D8D2FF',
    fontSize: 12,
  },

  listContent: {
    paddingBottom: 20,
  },

  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },

  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#7669D8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  onlineIndicator: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4ADE80',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#302078',
  },

  userDetails: {
    flex: 1,
  },

  userName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  username: {
    color: '#D8D2FF',
    fontSize: 12,
    marginTop: 3,
  },

  status: {
    color: '#BDB5E8',
    fontSize: 11,
    marginTop: 3,
  },

  messageButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 10,
  },

  messageButtonText: {
    color: '#302078',
    fontSize: 12,
    fontWeight: 'bold',
  },

  emptyText: {
    color: '#D8D2FF',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
});
