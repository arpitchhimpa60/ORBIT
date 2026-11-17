
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

export default function LoginScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Theme-aware styles
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: 28,
      paddingVertical: 50,
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
      fontSize: 38,
      fontWeight: "bold",
      color: theme.text,
      letterSpacing: 4,
    },

    heading: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.text,
      marginTop: 35,
    },

    description: {
      color: theme.secondaryText,
      fontSize: 14,
      marginTop: 10,
      textAlign: "center",
    },

    form: {
      width: "100%",
      marginTop: 35,
    },

    label: {
      color: theme.text,
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 9,
      marginTop: 18,
    },

    input: {
      backgroundColor: theme.input,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 15,
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
      paddingVertical: 15,
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
      marginTop: 35,
    },

    primaryButtonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: "bold",
    },

    footer: {
      flexDirection: "row",
      marginTop: 30,
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

  // Validate login details
  function handleLogin() {
    const emailValue = email.trim();

    if (emailValue === "" || password === "") {
      Alert.alert("Missing details", "Please enter your email and password.");
      return;
    }

    if (!emailValue.includes("@") || !emailValue.includes(".")) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Invalid password",
        "Password must contain at least 8 characters."
      );
      return;
    }

    navigation.replace("MainTabs");
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
          {/* Back Button */}
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <View style={styles.content}>
            {/* Logo */}
            <Text style={styles.logo}>ORBIT</Text>

            <Text style={styles.heading}>Welcome Back!</Text>

            <Text style={styles.description}>
              Login to continue your conversations.
            </Text>

            {/* Login Form */}
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
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.showPassword}>
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </Pressable>
              </View>

              <Pressable
                style={styles.primaryButton}
                onPress={handleLogin}
              >
                <Text style={styles.primaryButtonText}>Login</Text>
              </Pressable>
            </View>

            {/* Register Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don't have an account?
              </Text>

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
