
import { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';

import OrbitalBackground from '../components/OrbitalBackground';

export default function EditProfileScreen({ navigation, route }) {
  const currentProfile = route.params?.profile || {
    name: 'Arpit Chhimpa',
    username: '@arpit',
    about: 'Building connections, one conversation at a time.',
  };

  const [name, setName] = useState(currentProfile.name);
  const [about, setAbout] = useState(currentProfile.about);

  function handleSave() {
    if (name.trim() === '') {
      Alert.alert('Name required', 'Please enter your name.');
      return;
    }

    const updatedProfile = {
      ...currentProfile,
      name: name.trim(),
      about: about.trim(),
    };

    navigation.navigate('MainTabs', {
      screen: 'Profile',
      params: {
        updatedProfile: updatedProfile,
      },
    });
  }

  return (
    <OrbitalBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* Header */}
          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backText}>‹</Text>
            </Pressable>

            <View>
              <Text style={styles.heading}>Edit Profile</Text>
              <Text style={styles.description}>
                Update your personal information.
              </Text>
            </View>
          </View>

          {/* Profile Picture Placeholder */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {name.trim().charAt(0).toUpperCase() || '?'}
              </Text>
            </View>

            <Pressable
              style={styles.photoButton}
              onPress={() =>
                Alert.alert(
                  'Profile Picture',
                  'Gallery and Camera selection will be implemented later.'
                )
              }
            >
              <Text style={styles.photoButtonText}>
                Change Profile Picture
              </Text>
            </Pressable>
          </View>

          {/* Name */}
          <Text style={styles.label}>Display Name</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#BDB5E8"
            value={name}
            onChangeText={setName}
            maxLength={40}
          />

          {/* Username */}
          <Text style={styles.label}>Username</Text>

          <View style={styles.disabledInput}>
            <Text style={styles.disabledText}>
              {currentProfile.username}
            </Text>
          </View>

          <Text style={styles.note}>
            Username cannot be changed.
          </Text>

          {/* About */}
          <Text style={styles.label}>About</Text>

          <TextInput
            style={[styles.input, styles.aboutInput]}
            placeholder="Tell people something about yourself..."
            placeholderTextColor="#BDB5E8"
            value={about}
            onChangeText={setAbout}
            multiline
            maxLength={150}
            textAlignVertical="top"
          />

          <Text style={styles.characterCount}>
            {about.length}/150 characters
          </Text>

          {/* Buttons */}
          <Pressable
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>
              Save Changes
            </Text>
          </Pressable>

          <Pressable
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>
              Cancel
            </Text>
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
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

  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#7669D8',
    borderWidth: 3,
    borderColor: '#A99EFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: 'bold',
  },

  photoButton: {
    marginTop: 14,
    padding: 10,
  },

  photoButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  label: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 9,
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

  disabledInput: {
    backgroundColor: '#211650',
    borderWidth: 1,
    borderColor: '#6258E8',
    borderRadius: 12,
    padding: 15,
  },

  disabledText: {
    color: '#BDB5E8',
    fontSize: 14,
  },

  note: {
    color: '#BDB5E8',
    fontSize: 11,
    marginTop: 7,
    marginBottom: 22,
  },

  aboutInput: {
    height: 110,
  },

  characterCount: {
    color: '#BDB5E8',
    fontSize: 11,
    textAlign: 'right',
    marginTop: -15,
    marginBottom: 25,
  },

  saveButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 5,
  },

  saveButtonText: {
    color: '#302078',
    fontSize: 15,
    fontWeight: 'bold',
  },

  cancelButton: {
    borderWidth: 1,
    borderColor: '#A99EFF',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 35,
  },

  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
