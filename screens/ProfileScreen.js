
import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";

import OrbitalBackground from "../components/OrbitalBackground";
import { ThemeContext } from "../context/ThemeContext";

export default function ProfileScreen({ navigation, route }) {
  // Get global theme information
  const { theme, themeName, setThemeName } = useContext(ThemeContext);

  // Temporary profile information
  const [user, setUser] = useState({
    name: "Arpit Chhimpa",
    username: "@arpit",
    about: "Building connections, one conversation at a time.",
  });

  // Receive updated profile information
  const updatedProfile = route.params?.updatedProfile;

  useEffect(() => {
    if (updatedProfile) {
      setUser(updatedProfile);

      // Clear the parameter after receiving the data
      navigation.setParams({ updatedProfile: undefined });
    }
  }, [updatedProfile, navigation]);

  // Show placeholder messages
  function showComingSoon(feature) {
    Alert.alert(feature, `${feature} will be implemented in the next step.`);
  }

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

    profileCard: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 20,
      padding: 22,
      alignItems: "center",
      marginBottom: 28,
    },

    avatar: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
      borderWidth: 3,
      borderColor: theme.highlight,
    },

    avatarText: {
      color: "#FFFFFF",
      fontSize: 38,
      fontWeight: "bold",
    },

    name: {
      color: theme.text,
      fontSize: 21,
      fontWeight: "bold",
    },

    username: {
      color: theme.secondaryText,
      fontSize: 14,
      marginTop: 5,
    },

    about: {
      color: theme.secondaryText,
      fontSize: 13,
      textAlign: "center",
      marginTop: 15,
      lineHeight: 20,
    },

    editButton: {
      backgroundColor: theme.button,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 30,
      marginTop: 20,
    },

    editButtonText: {
      color: theme.buttonText,
      fontSize: 14,
      fontWeight: "bold",
    },

    sectionTitle: {
      color: theme.text,
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 12,
    },

    settingsCard: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 16,
      paddingHorizontal: 15,
      paddingVertical: 5,
      marginBottom: 25,
    },

    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 15,
    },

    settingIcon: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },

    iconText: {
      fontSize: 19,
      color: "#FFFFFF",
    },

    settingDetails: {
      flex: 1,
    },

    settingName: {
      color: theme.text,
      fontSize: 14,
      fontWeight: "600",
    },

    settingDescription: {
      color: theme.secondaryText,
      fontSize: 11,
      marginTop: 4,
    },

    arrow: {
      color: theme.secondaryText,
      fontSize: 28,
      marginLeft: 8,
    },

    separator: {
      height: 1,
      backgroundColor: theme.divider,
    },

    themeHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 15,
    },

    themeOptions: {
      flexDirection: "row",
      gap: 10,
      marginTop: 5,
    },

    themeButton: {
      flex: 1,
      backgroundColor: theme.secondaryBackground,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: "center",
    },

    activeTheme: {
      backgroundColor: theme.button,
      borderColor: theme.button,
    },

    themeButtonText: {
      color: theme.text,
      fontSize: 13,
      fontWeight: "600",
    },

    activeThemeText: {
      color: theme.buttonText,
    },

    themeNote: {
      color: theme.secondaryText,
      fontSize: 11,
      marginTop: 12,
      marginBottom: 15,
    },

    footer: {
      alignItems: "center",
      paddingVertical: 25,
      marginBottom: 15,
    },

    footerTitle: {
      color: theme.text,
      fontSize: 22,
      fontWeight: "bold",
      letterSpacing: 4,
    },

    footerDescription: {
      color: theme.secondaryText,
      fontSize: 12,
      marginTop: 5,
    },

    version: {
      color: theme.placeholder,
      fontSize: 10,
      marginTop: 10,
    },
  });

  return (
    <OrbitalBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          {/* Name and Username */}
          <Text style={styles.name}>{user.name}</Text>

          <Text style={styles.username}>{user.username}</Text>

          {/* About */}
          <Text style={styles.about}>{user.about}</Text>

          {/* Edit Profile */}
          <Pressable
            style={styles.editButton}
            onPress={() =>
              navigation.navigate("EditProfile", {
                profile: user,
              })
            }
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* Account Settings */}
        <Text style={styles.sectionTitle}>Account</Text>

        <View style={styles.settingsCard}>
          <Pressable
            style={styles.settingItem}
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <View style={styles.settingIcon}>
              <Text style={styles.iconText}>🔒</Text>
            </View>

            <View style={styles.settingDetails}>
              <Text style={styles.settingName}>Change Password</Text>

              <Text style={styles.settingDescription}>
                Update your account password
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>

          <View style={styles.separator} />

          <Pressable
            style={styles.settingItem}
            onPress={() => showComingSoon("Account Settings")}
          >
            <View style={styles.settingIcon}>
              <Text style={styles.iconText}>⚙</Text>
            </View>

            <View style={styles.settingDetails}>
              <Text style={styles.settingName}>Account Settings</Text>

              <Text style={styles.settingDescription}>
                Manage your account preferences
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>
        </View>

        {/* Appearance */}
        <Text style={styles.sectionTitle}>Appearance</Text>

        <View style={styles.settingsCard}>
          <View style={styles.themeHeader}>
            <View style={styles.settingIcon}>
              <Text style={styles.iconText}>☾</Text>
            </View>

            <View style={styles.settingDetails}>
              <Text style={styles.settingName}>App Theme</Text>

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
                themeName === "Light" && styles.activeTheme,
              ]}
              onPress={() => setThemeName("Light")}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  themeName === "Light" && styles.activeThemeText,
                ]}
              >
                ☀ Light
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.themeButton,
                themeName === "Dark" && styles.activeTheme,
              ]}
              onPress={() => setThemeName("Dark")}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  themeName === "Dark" && styles.activeThemeText,
                ]}
              >
                ☾ Dark
              </Text>
            </Pressable>
          </View>

          <Text style={styles.themeNote}>
            Selected preference: {themeName}
          </Text>
        </View>

        {/* App Information */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>ORBIT</Text>

          <Text style={styles.footerDescription}>
            Stay Connected. Stay in Orbit.
          </Text>

          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </OrbitalBackground>
  );
}
