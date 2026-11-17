
import { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';

import OrbitalBackground from '../components/OrbitalBackground';

export default function ProfileScreen() {
  const [theme, setTheme] = useState('Dark');

  // Temporary profile information
  const user = {
    name: 'Arpit Chhimpa',
    username: '@arpit',
    about: 'Building connections, one conversation at a time.',
  };

  // Show placeholder messages
  function showComingSoon(feature) {
    Alert.alert(
      feature,
      `${feature} will be implemented in the next step.`
    );
  }

  return (
    <OrbitalBackground>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>Profile</Text>

          <Text style={styles.description}>
            Your account and personal information.
          </Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>

          {/* Avatar */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name.charAt(0)}
            </Text>
          </View>

          {/* Name and Username */}
          <Text style={styles.name}>
            {user.name}
          </Text>

          <Text style={styles.username}>
            {user.username}
          </Text>

          {/* About */}
          <Text style={styles.about}>
            {user.about}
          </Text>

          {/* Edit Profile */}
          <Pressable
            style={styles.editButton}
            onPress={() => showComingSoon('Edit Profile')}
          >
            <Text style={styles.editButtonText}>
              Edit Profile
            </Text>
          </Pressable>

        </View>

        {/* Account Settings */}
        <Text style={styles.sectionTitle}>
          Account
        </Text>

        <View style={styles.settingsCard}>

          <Pressable
            style={styles.settingItem}
            onPress={() => showComingSoon('Change Password')}
          >
            <View style={styles.settingIcon}>
              <Text style={styles.iconText}>🔒</Text>
            </View>

            <View style={styles.settingDetails}>
              <Text style={styles.settingName}>
                Change Password
              </Text>

              <Text style={styles.settingDescription}>
                Update your account password
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>

          <View style={styles.separator} />

          <Pressable
            style={styles.settingItem}
            onPress={() => showComingSoon('Account Settings')}
          >
            <View style={styles.settingIcon}>
              <Text style={styles.iconText}>⚙</Text>
            </View>

            <View style={styles.settingDetails}>
              <Text style={styles.settingName}>
                Account Settings
              </Text>

              <Text style={styles.settingDescription}>
                Manage your account preferences
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>

        </View>

        {/* Appearance */}
        <Text style={styles.sectionTitle}>
          Appearance
        </Text>

        <View style={styles.settingsCard}>

          <View style={styles.themeHeader}>
            <View style={styles.settingIcon}>
              <Text style={styles.iconText}>☾</Text>
            </View>

            <View style={styles.settingDetails}>
              <Text style={styles.settingName}>
                App Theme
              </Text>

              <Text style={styles.settingDescription}>
                Choose your preferred appearance
              </Text>
            </View>
          </View>

          {/* Theme selection */}
          <View style={styles.themeOptions}>
            <Pressable
              style={[
                styles.themeButton,
                theme === 'Light' && styles.activeTheme,
              ]}
              onPress={() => setTheme('Light')}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  theme === 'Light' && styles.activeThemeText,
                ]}
              >
                ☀ Light
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.themeButton,
                theme === 'Dark' && styles.activeTheme,
              ]}
              onPress={() => setTheme('Dark')}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  theme === 'Dark' && styles.activeThemeText,
                ]}
              >
                ☾ Dark
              </Text>
            </Pressable>
          </View>

          <Text style={styles.themeNote}>
            Selected preference: {theme}
          </Text>

        </View>

        {/* App Information */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>
            ORBIT
          </Text>

          <Text style={styles.footerDescription}>
            Stay Connected. Stay in Orbit.
          </Text>

          <Text style={styles.version}>
            Version 1.0.0
          </Text>
        </View>

      </ScrollView>
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

  profileCard: {
    backgroundColor: '#40318C',
    borderWidth: 1,
    borderColor: '#6258E8',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    marginBottom: 28,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#7669D8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#A99EFF',
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: 'bold',
  },

  name: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: 'bold',
  },

  username: {
    color: '#D8D2FF',
    fontSize: 14,
    marginTop: 5,
  },

  about: {
    color: '#D8D2FF',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 20,
  },

  editButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
  },

  editButtonText: {
    color: '#302078',
    fontSize: 14,
    fontWeight: 'bold',
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  settingsCard: {
    backgroundColor: '#40318C',
    borderWidth: 1,
    borderColor: '#6258E8',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 25,
  },

  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },

  settingIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#7669D8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  iconText: {
    fontSize: 19,
    color: '#FFFFFF',
  },

  settingDetails: {
    flex: 1,
  },

  settingName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  settingDescription: {
    color: '#D8D2FF',
    fontSize: 11,
    marginTop: 4,
  },

  arrow: {
    color: '#D8D2FF',
    fontSize: 28,
    marginLeft: 8,
  },

  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },

  themeOptions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },

  themeButton: {
    flex: 1,
    backgroundColor: '#302078',
    borderWidth: 1,
    borderColor: '#7669D8',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },

  activeTheme: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },

  themeButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  activeThemeText: {
    color: '#302078',
  },

  themeNote: {
    color: '#D8D2FF',
    fontSize: 11,
    marginTop: 12,
    marginBottom: 15,
  },

  footer: {
    alignItems: 'center',
    paddingVertical: 25,
    marginBottom: 15,
  },

  footerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 4,
  },

  footerDescription: {
    color: '#D8D2FF',
    fontSize: 12,
    marginTop: 5,
  },

  version: {
    color: '#BDB5E8',
    fontSize: 10,
    marginTop: 10,
  },
});
