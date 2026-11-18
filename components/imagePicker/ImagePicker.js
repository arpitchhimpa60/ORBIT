
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export default async function openImagePicker() {
  try {
    // Check the current gallery permission
    let permission =
      await ImagePicker.getMediaLibraryPermissionsAsync();

    // Request permission if it has not been granted
    if (!permission.granted) {
      permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    // Stop if permission is still unavailable
    if (!permission.granted) {
      Alert.alert(
        "Gallery Permission Required",
        "Please allow ORBIT to access your photos from Settings."
      );

      return null;
    }

    // Open the device gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
      base64: true,
    });

    if (result.canceled) {
      return null;
    }

    return result.assets[0];

  } catch (error) {
    console.log("Image picker error:", error.message);

    Alert.alert(
      "Gallery Error",
      "Unable to open your photo gallery."
    );

    return null;
  }
}
