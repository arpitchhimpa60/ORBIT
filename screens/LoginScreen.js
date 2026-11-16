import { useState } from "react";

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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
        "Password must contain at least 8 characters.",
      );
      return;
    }

    Alert.alert("Login", "Authentication will be connected later.");
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
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back</Text>
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
                placeholderTextColor="#BDB5E8"
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
                  placeholderTextColor="#BDB5E8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />

                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.showPassword}>
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </Pressable>
              </View>

              <Pressable style={styles.primaryButton} onPress={handleLogin}>
                <Text style={styles.primaryButtonText}>Login</Text>
              </Pressable>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>

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
    color: "#FFFFFF",
    fontSize: 16,
  },

  content: {
    alignItems: "center",
  },

  logo: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 4,
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 35,
  },

  description: {
    color: "#D8D2FF",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },

  form: {
    width: "100%",
    marginTop: 35,
  },

  label: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 9,
    marginTop: 18,
  },

  input: {
    backgroundColor: "#40318C",
    borderWidth: 1,
    borderColor: "#7669D8",
    borderRadius: 12,
    padding: 15,
    color: "#FFFFFF",
    fontSize: 15,
  },

  primaryButton: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 35,
  },

  primaryButtonText: {
    color: "#302078",
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
    color: "#D8D2FF",
  },

  link: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#40318C",
    borderWidth: 1,
    borderColor: "#7669D8",
    borderRadius: 12,
    paddingHorizontal: 15,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 15,
    color: "#FFFFFF",
    fontSize: 15,
  },

  showPassword: {
    color: "#FFFFFF",
    fontWeight: "bold",
    paddingLeft: 10,
  },
});
