
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function UserAvatar({
  user,
  size = 50,
  theme,
  borderRadius,
}) {
  const imageUrl = user?.profilePicture;
  const initial = user?.name?.charAt(0)?.toUpperCase() || "?";

  const radius = borderRadius ?? size / 2;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: theme?.primary || "#7669D8",
        },
      ]}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: size,
            height: size,
            borderRadius: radius,
          }}
          resizeMode="cover"
        />
      ) : (
        <Text style={{ fontSize: size * 0.42, color: "#FFFFFF", fontWeight: "bold" }}>
          {initial}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});
