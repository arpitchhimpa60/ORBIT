import { View, Text, StyleSheet, Pressable } from "react-native";

import OrbitalBackground from "../components/OrbitalBackground";

export default function WelcomeScreen({ navigation }) {
  return (
    <OrbitalBackground>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.logo}>ORBIT</Text>

          <Text style={styles.tagline}>Stay Connected. Stay in Orbit.</Text>

          <Text style={styles.heading}>Welcome to ORBIT</Text>

          <Text style={styles.description}>
            Connect with people, share moments, and stay close to everyone who
            matters.
          </Text>

          <Pressable
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.primaryButtonText}>Login</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </Pressable>
        </View>
      </View>
    </OrbitalBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  content: {
    alignItems: "center",
  },

  logo: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 6,
  },

  tagline: {
    color: "#D8D2FF",
    fontSize: 14,
    marginTop: 10,
    letterSpacing: 1,
  },

  heading: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 65,
  },

  description: {
    color: "#D8D2FF",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 23,
    marginTop: 15,
    marginBottom: 35,
  },

  primaryButton: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },

  primaryButtonText: {
    color: "#302078",
    fontSize: 16,
    fontWeight: "bold",
  },

  secondaryButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },

  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
