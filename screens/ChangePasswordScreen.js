
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

export default function ChangePasswordScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      fontSize: 25,
      fontWeight: "bold",
    },

    description: {
      color: theme.secondaryText,
      fontSize: 13,
      marginTop: 4,
    },

    infoCard: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 16,
      padding: 17,
      marginBottom: 28,
    },

    infoTitle: {
      color: theme.text,
      fontSize: 15,
      fontWeight: "bold",
      marginBottom: 10,
    },

    infoText: {
      color: theme.secondaryText,
      fontSize: 12,
      lineHeight: 22,
    },

    label: {
      color: theme.text,
      fontSize: 15,
      fontWeight: "bold",
      marginBottom: 9,
    },

    passwordContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.input,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 13,
      paddingHorizontal: 14,
      marginBottom: 23,
    },

    passwordInput: {
      flex: 1,
      paddingVertical: 15,
      color: theme.text,
      fontSize: 14,
    },

    showButton: {
      color: theme.highlight,
      fontSize: 12,
      fontWeight: "bold",
      padding: 8,
    },

    saveButton: {
      backgroundColor: theme.button,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 13,
      paddingVertical: 15,
      alignItems: "center",
      marginTop: 10,
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

  // Validate and save the new password
  function handleSave() {
    if (
      currentPassword.trim() === "" ||
      newPassword.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      Alert.alert("Missing fields", "Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert(
        "Weak password",
        "Your new password must contain at least 8 characters."
      );
      return;
    }

    if (newPassword === currentPassword) {
      Alert.alert(
        "Same password",
        "Your new password must be different from your current password."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Password mismatch",
        "Your new password and confirmation do not match."
      );
      return;
    }

    Alert.alert(
      "Password validated",
      "Your new password passed the frontend checks. Actual password updating will be connected to the backend later.",
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]
    );
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
              <Text style={styles.heading}>Change Password</Text>

              <Text style={styles.description}>
                Keep your ORBIT account secure.
              </Text>
            </View>
          </View>

          {/* Password Requirements */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              Password requirements
            </Text>

            <Text style={styles.infoText}>
              • At least 8 characters
            </Text>

            <Text style={styles.infoText}>
              • New password must be different from your current password
            </Text>

            <Text style={styles.infoText}>
              • Both new password fields must match
            </Text>
          </View>

          {/* Current Password */}
          <Text style={styles.label}>Current Password</Text>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter current password"
              placeholderTextColor={theme.placeholder}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
              autoCapitalize="none"
            />

            <Pressable
              onPress={() =>
                setShowCurrentPassword(!showCurrentPassword)
              }
            >
              <Text style={styles.showButton}>
                {showCurrentPassword ? "Hide" : "Show"}
              </Text>
            </Pressable>
          </View>

          {/* New Password */}
          <Text style={styles.label}>New Password</Text>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter new password"
              placeholderTextColor={theme.placeholder}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
            />

            <Pressable
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Text style={styles.showButton}>
                {showNewPassword ? "Hide" : "Show"}
              </Text>
            </Pressable>
          </View>

          {/* Confirm New Password */}
          <Text style={styles.label}>Confirm New Password</Text>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm new password"
              placeholderTextColor={theme.placeholder}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />

            <Pressable
              onPress={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              <Text style={styles.showButton}>
                {showConfirmPassword ? "Hide" : "Show"}
              </Text>
            </Pressable>
          </View>

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
