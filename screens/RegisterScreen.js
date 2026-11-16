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

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleRegister() {
    const nameValue = name.trim();
    const usernameValue = username.trim();
    const emailValue = email.trim();

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

    if (usernameValue.length < 3) {
      Alert.alert(
        "Invalid username",
        "Username must contain at least 3 characters.",
      );
      return;
    }

    if (usernameValue.includes(" ")) {
      Alert.alert("Invalid username", "Username cannot contain spaces.");
      return;
    }

    if (!emailValue.includes("@") || !emailValue.includes(".")) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Weak password",
        "Password must contain at least 8 characters.",
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Your passwords do not match.");
      return;
    }

    navigation.replace('MainTabs');
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

            <Text style={styles.heading}>Create Account</Text>

            <Text style={styles.description}>
              Join ORBIT and stay connected.
            </Text>

            <View style={styles.form}>
              <Text style={styles.label}>Full Name</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#BDB5E8"
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.label}>Username</Text>

              <TextInput
                style={styles.input}
                placeholder="Choose a username"
                placeholderTextColor="#BDB5E8"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />

              <Text style={styles.label}>Email Address</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#BDB5E8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Password</Text>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Create a password"
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

              <Text style={styles.label}>Confirm Password</Text>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter password again"
                  placeholderTextColor="#BDB5E8"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />

                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Text style={styles.showPassword}>
                    {showConfirmPassword ? "Hide" : "Show"}
                  </Text>
                </Pressable>
              </View>

              <Pressable style={styles.primaryButton} onPress={handleRegister}>
                <Text style={styles.primaryButtonText}>Create Account</Text>
              </Pressable>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>

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
    color: "#FFFFFF",
    fontSize: 16,
  },

  content: {
    alignItems: "center",
  },

  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 4,
  },

  heading: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 25,
  },

  description: {
    color: "#D8D2FF",
    fontSize: 14,
    marginTop: 9,
  },

  form: {
    width: "100%",
    marginTop: 25,
  },

  label: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 15,
  },

  input: {
    backgroundColor: "#40318C",
    borderWidth: 1,
    borderColor: "#7669D8",
    borderRadius: 12,
    padding: 14,
    color: "#FFFFFF",
    fontSize: 15,
  },

  primaryButton: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },

  primaryButtonText: {
    color: "#302078",
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
    paddingVertical: 14,
    color: "#FFFFFF",
    fontSize: 15,
  },

  showPassword: {
    color: "#FFFFFF",
    fontWeight: "bold",
    paddingLeft: 10,
  },
});
