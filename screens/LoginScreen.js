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
import { AuthContext } from "../context/AuthContext";
import { apiRequest } from "../services/api";

export default function LoginScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const styles = StyleSheet.create({
    container: {
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
      fontSize: 26,
      fontWeight: "600",
      lineHeight: 30,
    },
    content: {
      width: "100%",
      maxWidth: 480,
      alignSelf: "center",
      alignItems: "center",
    },
    logo: {
      fontSize: 34,
      fontWeight: "800",
      color: theme.text,
      letterSpacing: 4,
    },
    heading: {
      fontSize: 27,
      fontWeight: "700",
      color: theme.text,
      marginTop: 25,
    },
    description: {
      color: theme.secondaryText,
      fontSize: 14,
      marginTop: 10,
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
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.input,
      borderWidth: 1,
      borderColor: theme.border,
      minHeight: 52,
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
    showPassword: {
      color: theme.highlight,
      fontWeight: "bold",
      fontSize: 12,
    },
    visibilityButton: {
      minWidth: 54,
      minHeight: 38,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 8,
      borderRadius: 10,
    },
    primaryButton: {
      backgroundColor: theme.button,
      borderWidth: 1,
      borderColor: theme.border,
      minHeight: 54,
      paddingHorizontal: 18,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 28,
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

  async function handleLogin() {
    const emailValue = email.trim().toLowerCase();

    if (emailValue === "" || password === "") {
      Alert.alert("Missing details", "Please enter your email and password.");
      return;
    }

    if (!emailValue.includes("@") || !emailValue.includes(".")) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Invalid password", "Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const result = await apiRequest("/api/auth/login", "POST", {
        email: emailValue,
        password: password,
      });

      await login(result.user, result.token);
    } catch (error) {
      Alert.alert("Login failed", error.message);
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
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <View style={styles.content}>
            <Text style={styles.logo}>ORBIT</Text>
            <Text style={styles.heading}>Welcome Back!</Text>
            <Text style={styles.description}>
              Login to continue your conversations.
            </Text>

            <View style={styles.form}>
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
                  placeholder="Enter your password"
                  placeholderTextColor={theme.placeholder}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />

                <Pressable
                  style={styles.visibilityButton}
                  onPress={() => setShowPassword(!showPassword)}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                  hitSlop={8}
                >
                  <Text style={styles.showPassword}>
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </Pressable>
              </View>

              <Pressable
                style={styles.primaryButton}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? "Logging in..." : "Login"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don&apos;t have an account?</Text>

              <Pressable onPress={() => navigation.navigate("Register")}>
                <Text style={styles.link}> Create Account</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </OrbitalBackground>
  );
}
