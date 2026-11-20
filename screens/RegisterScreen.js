import { useState, useContext } from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import OrbitalBackground from "../components/OrbitalBackground";
import { ThemeContext } from "../context/ThemeContext";
import { apiRequest } from "../services/api";

export default function RegisterScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const styles = StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: 24,
      paddingTop: 76,
      paddingBottom: 36,
    },
    backButton: {
      position: "absolute",
      top: 18,
      left: 24,
      zIndex: 1,
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    backText: {
      color: theme.text,
      fontSize: 28,
      lineHeight: 31,
      marginTop: -3,
    },
    content: {
      width: "100%",
      maxWidth: 480,
      alignSelf: "center",
      alignItems: "center",
    },
    logo: {
      color: theme.text,
      fontSize: 34,
      fontWeight: "800",
      letterSpacing: 5,
    },
    tagline: {
      color: theme.secondaryText,
      fontSize: 11,
      letterSpacing: 2,
      marginTop: 5,
      textTransform: "uppercase",
    },
    heading: {
      color: theme.text,
      fontSize: 27,
      fontWeight: "700",
      marginTop: 25,
      textAlign: "center",
    },
    description: {
      color: theme.secondaryText,
      fontSize: 14,
      lineHeight: 21,
      marginTop: 8,
      textAlign: "center",
    },
    form: {
      width: "100%",
      marginTop: 24,
    },
    label: {
      color: theme.text,
      fontSize: 13,
      fontWeight: "600",
      marginBottom: 8,
      marginTop: 15,
    },
    input: {
      minHeight: 52,
      backgroundColor: theme.input,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 13,
      color: theme.text,
      fontSize: 15,
    },
    passwordContainer: {
      minHeight: 52,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.input,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14,
      paddingLeft: 16,
      paddingRight: 10,
    },
    passwordInput: {
      flex: 1,
      minWidth: 0,
      paddingVertical: 13,
      color: theme.text,
      fontSize: 15,
    },
    visibilityButton: {
      minWidth: 54,
      minHeight: 38,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 8,
      borderRadius: 10,
    },
    visibilityText: {
      color: theme.highlight,
      fontSize: 12,
      fontWeight: "700",
    },
    primaryButton: {
      minHeight: 54,
      backgroundColor: theme.button,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 18,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 28,
      opacity: loading ? 0.65 : 1,
    },
    primaryButtonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: "700",
    },
    footer: {
      flexDirection: "row",
      marginTop: 25,
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
    },
    footerText: {
      color: theme.secondaryText,
      fontSize: 13,
    },
    link: {
      color: theme.highlight,
      fontSize: 13,
      fontWeight: "700",
      paddingVertical: 6,
      paddingHorizontal: 3,
    },
  });

  // Register user through backend
  async function handleRegister() {
    const nameValue = name.trim();
    const usernameValue = username.trim().toLowerCase();
    const emailValue = email.trim().toLowerCase();

    if (
      nameValue === "" ||
      usernameValue === "" ||
      emailValue === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      Alert.alert("Missing details", "Please fill in all fields.");
      return;
    }

    if (
      usernameValue.length < 3 ||
      !/^[a-zA-Z0-9_]+$/.test(usernameValue)
    ) {
      Alert.alert(
        "Invalid username",
        "Username must contain at least 3 characters and only letters, numbers or underscores."
      );
      return;
    }

    if (!emailValue.includes("@") || !emailValue.includes(".")) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Weak password",
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Your passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await apiRequest("/api/auth/register", "POST", {
        name: nameValue,
        username: usernameValue,
        email: emailValue,
        password: password,
      });

      Alert.alert(
        "Registration successful",
        "Your ORBIT account has been created. Please log in.",
        [
          {
            text: "Continue",
            onPress: () => {
              navigation.replace("Login");
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Registration failed", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <OrbitalBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <View style={styles.content}>
            <Text style={styles.logo}>ORBIT</Text>
            <Text style={styles.tagline}>Stay Connected. Stay in Orbit.</Text>

            <Text style={styles.heading}>Create Account</Text>
            <Text style={styles.description}>
              Join ORBIT and stay connected with your people.
            </Text>

            <View style={styles.form}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={theme.placeholder}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
                autoComplete="name"
                returnKeyType="next"
              />

              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Choose a username"
                placeholderTextColor={theme.placeholder}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="username"
                returnKeyType="next"
              />

              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={theme.placeholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                returnKeyType="next"
              />

              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Create a password"
                  placeholderTextColor={theme.placeholder}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  returnKeyType="next"
                />
                <Pressable
                  style={styles.visibilityButton}
                  onPress={() => setShowPassword((current) => !current)}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                  hitSlop={6}
                >
                  <Text style={styles.visibilityText}>
                    {showPassword ? "HIDE" : "SHOW"}
                  </Text>
                </Pressable>
              </View>

              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter password again"
                  placeholderTextColor={theme.placeholder}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                />
                <Pressable
                  style={styles.visibilityButton}
                  onPress={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  accessibilityRole="button"
                  accessibilityLabel={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  hitSlop={6}
                >
                  <Text style={styles.visibilityText}>
                    {showConfirmPassword ? "HIDE" : "SHOW"}
                  </Text>
                </Pressable>
              </View>

              <Pressable
                style={styles.primaryButton}
                onPress={handleRegister}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Create account"
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <Pressable
                onPress={() => navigation.navigate("Login")}
                accessibilityRole="button"
                hitSlop={6}
              >
                <Text style={styles.link}> Login</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </OrbitalBackground>
  );
}
