
import { useState, useEffect } from 'react';

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
} from 'react-native';

import OrbitalBackground from '../components/OrbitalBackground';

// Temporary sample users
const users = [
  { id: '1', name: 'Rahul Sharma', username: '@rahul', online: true },
  { id: '2', name: 'Ananya Singh', username: '@ananya', online: true },
  { id: '3', name: 'Ketan Agarwal', username: '@ketan', online: false },
  { id: '4', name: 'Arnav Goyal', username: '@arnav', online: false },
  { id: '5', name: 'Asmi Mishra', username: '@asmi', online: true },
  { id: '6', name: 'Priya Verma', username: '@priya', online: false },
];

export default function CreateGroupScreen({ navigation }) {
  const [groupName, setGroupName] = useState('');
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

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
  if (groupName.trim() === '') {
    Alert.alert('Group name required', 'Please enter a group name.');
    return;
  }

  if (selectedUsers.length === 0) {
    Alert.alert(
      'Add members',
      'Please select at least one other member.'
    );
    return;
  }

  // Create a new group object
  const newGroup = {
    id: Date.now().toString(),
    name: groupName.trim(),
    members: selectedUsers.length + 1,
    message: 'Group created',
    time: 'Just now',
    unread: 0,
  };

  // Return to Groups and pass the new group
  navigation.navigate('MainTabs', {
    screen: 'Groups',
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
            {item.name.charAt(0)}
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
            {isSelected ? 'Selected' : 'Add'}
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <OrbitalBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
              placeholderTextColor="#BDB5E8"
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
            <Text style={styles.sectionTitle}>
              Add members
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Search by name or username..."
              placeholderTextColor="#BDB5E8"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#40318C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  backText: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 36,
  },

  heading: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: 'bold',
  },

  description: {
    color: '#D8D2FF',
    fontSize: 12,
    marginTop: 4,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },

  input: {
    backgroundColor: '#40318C',
    borderWidth: 1,
    borderColor: '#7669D8',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 22,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  memberCount: {
    color: '#D8D2FF',
    fontSize: 12,
    marginBottom: 10,
  },

  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 22,
  },

  memberChip: {
    backgroundColor: '#7669D8',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },

  memberChipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  emptySelection: {
    color: '#BDB5E8',
    fontSize: 13,
    marginBottom: 22,
  },

  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7669D8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
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

  selectButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },

  selectedButton: {
    backgroundColor: '#7669D8',
    borderWidth: 1,
    borderColor: '#A99EFF',
  },

  selectButtonText: {
    color: '#302078',
    fontSize: 12,
    fontWeight: 'bold',
  },

  selectedButtonText: {
    color: '#FFFFFF',
  },

  createButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 30,
  },

  createButtonText: {
    color: '#302078',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
