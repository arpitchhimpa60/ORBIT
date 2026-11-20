import { View, Text, StyleSheet } from "react-native";

export default function GroupAvatar({ name, size = 55, theme }) {
  const radius = Math.round(size * 0.3);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: theme?.primary || "#7669D8",
          marginRight: 13,
        },
      ]}
      accessible
      accessibilityLabel={`${name || "Group"} group avatar`}
    >
      <Text style={[styles.initial, { fontSize: size * 0.38 }]}>
        {name?.trim()?.charAt(0)?.toUpperCase() || "G"}
      </Text>
      <View
        style={[
          styles.orbit,
          {
            width: size * 0.28,
            height: size * 0.28,
            borderRadius: size * 0.14,
            backgroundColor: theme?.highlight || "#A99EFF",
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  initial: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  orbit: {
    position: "absolute",
    right: "12%",
    top: "12%",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.75)",
  },
});
