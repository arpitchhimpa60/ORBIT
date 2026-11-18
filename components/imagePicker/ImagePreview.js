
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";

export default function ImagePreview({
  image,
  onCancel,
  onSend,
  theme,
  actionLabel = "Send",
}) {
  if (!image) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14,
      padding: 12,
      marginBottom: 12,
    },

    title: {
      color: theme.text,
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 10,
    },

    previewImage: {
      width: "100%",
      height: 200,
      borderRadius: 10,
      resizeMode: "contain",
      backgroundColor: theme.background,
    },

    buttonContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      marginTop: 12,
      gap: 10,
    },

    cancelButton: {
      paddingHorizontal: 15,
      paddingVertical: 10,
    },

    cancelText: {
      color: theme.secondaryText,
      fontSize: 13,
      fontWeight: "bold",
    },

    sendButton: {
      backgroundColor: theme.button,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
    },

    sendText: {
      color: theme.buttonText,
      fontSize: 13,
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Preview</Text>

      <Image
        source={{ uri: image.uri }}
        style={styles.previewImage}
      />

      <View style={styles.buttonContainer}>
        <Pressable onPress={onCancel} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>

        <Pressable onPress={onSend} style={styles.sendButton}>
          <Text style={styles.sendText}>{actionLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}
