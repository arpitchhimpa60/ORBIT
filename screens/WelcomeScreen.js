import { useContext } from "react";

import { View, Text, StyleSheet, Pressable } from "react-native";

import OrbitalBackground from "../components/OrbitalBackground";
import { ThemeContext } from "../context/ThemeContext";

export default function WelcomeScreen({ navigation }) {
  const { theme, themeName, setThemeName } = useContext(ThemeContext);

  // Switch to the opposite theme
  function toggleTheme() {
    if (themeName === "Dark") {
      setThemeName("Light");
    } else {
      setThemeName("Dark");
    }
  }

  // Theme-aware styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 28,
    },

    themeButton: {
      position: "absolute",
      top: 15,
      left: 25,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 16,
      zIndex: 10,
    },

    themeButtonText: {
      color: theme.text,
      fontSize: 13,
      fontWeight: "bold",
    },

    content: {
      alignItems: "center",
    },

    logo: {
      fontSize: 48,
      fontWeight: "bold",
      color: theme.text,
      letterSpacing: 6,
    },

    tagline: {
      color: theme.secondaryText,
      fontSize: 14,
      marginTop: 10,
      letterSpacing: 1,
    },

    heading: {
      color: theme.text,
      fontSize: 28,
      fontWeight: "bold",
      marginTop: 65,
    },

    description: {
      color: theme.secondaryText,
      fontSize: 15,
      textAlign: "center",
      lineHeight: 23,
      marginTop: 15,
      marginBottom: 35,
    },

    primaryButton: {
      width: "100%",
      backgroundColor: theme.button,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 15,
    },

    primaryButtonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: "bold",
    },

    secondaryButton: {
      width: "100%",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 15,
    },

    secondaryButtonText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "bold",
    },
    themeButton: {
      position: "absolute",
      top: 15,
      left: 25,
      width: 105,
      height: 42,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
    },

    themeButtonText: {
      color: theme.text,
      fontSize: 13,
      fontWeight: "bold",
      textAlign: "center",
    },
  });

  return (
    <OrbitalBackground>
      <View style={styles.container}>
        {/* Single Theme Toggle Button */}
        <Pressable style={styles.themeButton} onPress={toggleTheme}>
          <Text style={styles.themeButtonText}>
            {themeName === "Dark" ? "☾ Dark" : "☀ Light"}
          </Text>
        </Pressable>

        <View style={styles.content}>
          {/* ORBIT Logo */}
          <Text style={styles.logo}>ORBIT</Text>

          <Text style={styles.tagline}>Stay Connected. Stay in Orbit.</Text>

          {/* Welcome Message */}
          <Text style={styles.heading}>Welcome to ORBIT</Text>

          <Text style={styles.description}>
            Connect with people, share moments, and stay close to everyone who
            matters.
          </Text>

          {/* Login Button */}
          <Pressable
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.primaryButtonText}>Login</Text>
          </Pressable>

          {/* Register Button */}
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
