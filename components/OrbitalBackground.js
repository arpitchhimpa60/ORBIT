import { View, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
export default function OrbitalBackground({ children }) {
  return (
    <View style={styles.container}>
      {/* Orbital rings */}
      <View style={styles.orbitOne} />
      <View style={styles.orbitTwo} />

      {/* Planet */}
      <View style={styles.planet} />

      {/* Stars */}
      <View style={styles.starOne} />
      <View style={styles.starTwo} />
      <View style={styles.starThree} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#302078",
    overflow: "hidden",
  },

  orbitOne: {
    position: "absolute",
    width: 380,
    height: 380,
    borderRadius: 190,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    top: -180,
    right: -170,
  },

  orbitTwo: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    top: -120,
    right: -120,
  },

  planet: {
    position: "absolute",
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#7669D8",
    top: 110,
    right: 45,
  },

  starOne: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    top: 230,
    left: 35,
  },

  starTwo: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#C7BEFF",
    top: 350,
    right: 35,
  },

  starThree: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    bottom: 100,
    left: 65,
  },
});
