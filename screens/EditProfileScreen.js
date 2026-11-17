
import { useState, useContext } from "react";

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
} from "react-native";

import OrbitalBackground from "../components/OrbitalBackground";
import { ThemeContext } from "../context/ThemeContext";

export default function EditProfileScreen({ navigation, route }) {
  const { theme } = useContext(ThemeContext);

  const currentProfile = route.params?.profile || {
    name: "Arpit Chhimpa",
    username: "@arpit",
    about: "Building connections, one conversation at a time.",
  };

  const [name, setName] = useState(currentProfile.name);
  const [about, setAbout] = useState(currentProfile.about);

  // Theme-aware styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 30,
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

    avatarSection: {
      alignItems: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 20,
      padding: 22,
      marginBottom: 25,
    },

    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.primary,
      borderWidth: 3,
      borderColor: theme.highlight,
      justifyContent: "center",
      alignItems: "center",
    },

    avatarText: {
      color: "#FFFFFF",
      fontSize: 42,
      fontWeight: "bold",
    },

    photoButton: {
      marginTop: 12,
      padding: 10,
    },

    photoButtonText: {
      color: theme.highlight,
      fontSize: 13,
      fontWeight: "600",
    },

    label: {
      color: theme.text,
      fontSize: 15,
      fontWeight: "bold",
      marginBottom: 9,
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

    disabledInput: {
      backgroundColor: theme.secondaryBackground,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 13,
      padding: 15,
    },

    disabledText: {
      color: theme.secondaryText,
      fontSize: 14,
    },

    note: {
      color: theme.placeholder,
      fontSize: 11,
      marginTop: 7,
      marginBottom: 22,
    },

    aboutInput: {
      height: 110,
    },

    characterCount: {
      color: theme.placeholder,
      fontSize: 11,
      textAlign: "right",
      marginTop: -15,
      marginBottom: 25,
    },

    saveButton: {
      backgroundColor: theme.button,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 13,
      paddingVertical: 15,
      alignItems: "center",
      marginTop: 5,
    },

    saveButtonText: {
      color: theme.buttonText,
      fontSize: 15,
      fontWeight: "bold",
    },

    cancelButton: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 13,
      paddingVertical: 15,
      alignItems: "center",
      marginTop: 12,
      marginBottom: 35,
    },

    cancelButtonText: {
      color: theme.text,
      fontSize: 14,
      fontWeight: "600",
    },
  });

  function handleSave() {
    if (name.trim() === "") {
      Alert.alert("Name required", "Please enter your name.");
      return;
    }

    const updatedProfile = {
      ...currentProfile,
      name: name.trim(),
      about: about.trim(),
    };

    navigation.navigate("MainTabs", {
      screen: "Profile",
      params: {
        updatedProfile: updatedProfile,
      },
    });
  }

  return (
    <OrbitalBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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

          {/* Profile Picture */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {name.trim().charAt(0).toUpperCase() || "?"}
              </Text>
            </View>

            <Pressable
              style={styles.photoButton}
              onPress={() =>
                Alert.alert(
                  "Profile Picture",
                  "Gallery and Camera selection will be implemented later."
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
            placeholderTextColor={theme.placeholder}
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
            placeholderTextColor={theme.placeholder}
            value={about}
            onChangeText={setAbout}
            multiline
            maxLength={150}
            textAlignVertical="top"
          />

          <Text style={styles.characterCount}>
            {about.length}/150 characters
          </Text>

          {/* Save Button */}
          <Pressable
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>
              Save Changes
            </Text>
          </Pressable>

          {/* Cancel Button */}
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
