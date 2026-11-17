
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
    container: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: 28,
      paddingVertical: 55,
    },

    backButton: {
      position: "absolute",
      top: 55,
      left: 28,
      zIndex: 1,
    },

    backText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "600",
    },

    content: {
      alignItems: "center",
    },

    logo: {
      fontSize: 36,
      fontWeight: "bold",
      color: theme.text,
      letterSpacing: 4,
    },

    heading: {
      fontSize: 27,
      fontWeight: "bold",
      color: theme.text,
      marginTop: 25,
    },

    description: {
      color: theme.secondaryText,
      fontSize: 14,
      marginTop: 9,
      textAlign: "center",
    },

    form: {
      width: "100%",
      marginTop: 25,
    },

    label: {
      color: theme.text,
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 8,
      marginTop: 15,
    },

    input: {
      backgroundColor: theme.input,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 14,
      color: theme.text,
      fontSize: 15,
    },

    passwordContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.input,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 15,
    },

    passwordInput: {
      flex: 1,
      paddingVertical: 14,
      color: theme.text,
      fontSize: 15,
    },

    showPassword: {
      color: theme.highlight,
      fontWeight: "bold",
      paddingLeft: 10,
    },

    primaryButton: {
      backgroundColor: theme.button,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 30,
      opacity: loading ? 0.6 : 1,
    },

    primaryButtonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: "bold",
    },

    footer: {
      flexDirection: "row",
      marginTop: 25,
      alignItems: "center",
      flexWrap: "wrap",
      justifyContent: "center",
    },

    footerText: {
      color: theme.secondaryText,
    },

    link: {
      color: theme.highlight,
      fontWeight: "bold",
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

      const result = await apiRequest("/api/auth/register", "POST", {
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
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <View style={styles.content}>
            <Text style={styles.logo}>ORBIT</Text>

            <Text style={styles.heading}>Create Account</Text>

            <Text style={styles.description}>
              Join ORBIT and stay connected.
            </Text>

            <View style={styles.form}>
              <Text style={styles.label}>Full Name</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={theme.placeholder}
                value={name}
                onChangeText={setName}
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
                />

                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.showPassword}>
                    {showPassword ? "Hide" : "Show"}
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
                />

                <Pressable
                  onPress={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  <Text style={styles.showPassword}>
                    {showConfirmPassword ? "Hide" : "Show"}
                  </Text>
                </Pressable>
              </View>

              <Pressable
                style={styles.primaryButton}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account?
              </Text>

              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text style={styles.link}> Login</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </OrbitalBackground>
  );
}
