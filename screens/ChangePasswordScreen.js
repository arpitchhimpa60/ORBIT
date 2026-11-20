import { useContext, useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";

import OrbitalBackground from "../components/OrbitalBackground";
import { ThemeContext } from "../context/ThemeContext";
import { apiRequest } from "../services/api";

export default function ChangePasswordScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
    backButton: {
      width: 44, height: 44, borderRadius: 13,
      backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border,
      justifyContent: "center", alignItems: "center", marginRight: 13,
    },
    backText: { color: theme.text, fontSize: 30, lineHeight: 36 },
    heading: { color: theme.text, fontSize: 25, fontWeight: "bold" },
    description: { color: theme.secondaryText, fontSize: 13, marginTop: 4 },
    infoCard: {
      backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border,
      borderRadius: 16, padding: 17, marginBottom: 28,
    },
    infoTitle: { color: theme.text, fontSize: 15, fontWeight: "bold", marginBottom: 10 },
    infoText: { color: theme.secondaryText, fontSize: 12, lineHeight: 22 },
    label: { color: theme.text, fontSize: 15, fontWeight: "bold", marginBottom: 9 },
    passwordContainer: {
      flexDirection: "row", alignItems: "center", backgroundColor: theme.input,
      borderWidth: 1, borderColor: theme.border, borderRadius: 13,
      paddingHorizontal: 14, marginBottom: 23,
    },
    passwordInput: { flex: 1, paddingVertical: 15, color: theme.text, fontSize: 14 },
    showButton: { color: theme.highlight, fontSize: 12, fontWeight: "bold", padding: 8 },
    saveButton: {
      backgroundColor: theme.button, borderWidth: 1, borderColor: theme.border,
      borderRadius: 13, paddingVertical: 15, alignItems: "center", marginTop: 10,
    },
    saveButtonText: { color: theme.buttonText, fontSize: 15, fontWeight: "bold" },
    cancelButton: {
      backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border,
      borderRadius: 13, paddingVertical: 15, alignItems: "center",
      marginTop: 12, marginBottom: 35,
    },
    cancelButtonText: { color: theme.text, fontSize: 14, fontWeight: "600" },
  });

  async function handleSave() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Missing fields", "Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("Weak password", "Your new password must contain at least 8 characters.");
      return;
    }
    if (newPassword === currentPassword) {
      Alert.alert("Same password", "Your new password must be different from your current password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Password mismatch", "Your new password and confirmation do not match.");
      return;
    }

    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) throw new Error("Please log in again.");

      const result = await apiRequest(
        "/api/auth/change-password",
        "PATCH",
        { currentPassword, newPassword },
        token
      );

      Alert.alert("Password changed", result.message || "Your password was updated successfully.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Alert.alert("Unable to change password", error.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function renderPasswordField(label, value, setValue, visible, setVisible, placeholder) {
    return (
      <>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder={placeholder}
            placeholderTextColor={theme.placeholder}
            value={value}
            onChangeText={setValue}
            secureTextEntry={!visible}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
          <Pressable onPress={() => setVisible(!visible)} disabled={loading} hitSlop={10}>
            <Text style={styles.showButton}>{visible ? "Hide" : "Show"}</Text>
          </Pressable>
        </View>
      </>
    );
  }

  return (
    <OrbitalBackground>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => navigation.goBack()} disabled={loading}>
              <Text style={styles.backText}>‹</Text>
            </Pressable>
            <View>
              <Text style={styles.heading}>Change Password</Text>
              <Text style={styles.description}>Keep your ORBIT account secure.</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Password requirements</Text>
            <Text style={styles.infoText}>• At least 8 characters</Text>
            <Text style={styles.infoText}>• New password must differ from your current password</Text>
            <Text style={styles.infoText}>• Both new password fields must match</Text>
          </View>

          {renderPasswordField("Current Password", currentPassword, setCurrentPassword, showCurrentPassword, setShowCurrentPassword, "Enter current password")}
          {renderPasswordField("New Password", newPassword, setNewPassword, showNewPassword, setShowNewPassword, "Enter new password")}
          {renderPasswordField("Confirm New Password", confirmPassword, setConfirmPassword, showConfirmPassword, setShowConfirmPassword, "Confirm new password")}

          <Pressable style={[styles.saveButton, loading && { opacity: 0.65 }]} onPress={handleSave} disabled={loading}>
            {loading ? <ActivityIndicator color={theme.buttonText} /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={loading}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </OrbitalBackground>
  );
}
