
import { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemeContext } from "../context/ThemeContext";

export default function OrbitalBackground({ children }) {
  const { theme } = useContext(ThemeContext);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      {/* Orbital rings */}
      <View
        style={[
          styles.orbitOne,
          { borderColor: theme.orbit },
        ]}
      />

      <View
        style={[
          styles.orbitTwo,
          { borderColor: theme.orbit },
        ]}
      />

      {/* Planet */}
      <View
        style={[
          styles.planet,
          { backgroundColor: theme.planet },
        ]}
      />

      {/* Stars */}
      <View
        style={[
          styles.starOne,
          { backgroundColor: theme.star },
        ]}
      />

      <View
        style={[
          styles.starTwo,
          { backgroundColor: theme.highlight },
        ]}
      />

      <View
        style={[
          styles.starThree,
          { backgroundColor: theme.star },
        ]}
      />

      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },

  orbitOne: {
    position: "absolute",
    width: 380,
    height: 380,
    borderRadius: 190,
    borderWidth: 1,
    top: -180,
    right: -170,
  },

  orbitTwo: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
    top: -120,
    right: -120,
  },

  planet: {
    position: "absolute",
    width: 55,
    height: 55,
    borderRadius: 30,
    top: 110,
    right: 45,
  },

  starOne: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 5,
    top: 230,
    left: 35,
  },

  starTwo: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 5,
    top: 350,
    right: 35,
  },

  starThree: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 5,
    bottom: 100,
    left: 65,
  },
});
