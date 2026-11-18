
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

// Open the device gallery
async function openGallery() {
  try {
    let permission =
      await ImagePicker.getMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (!permission.granted) {
      Alert.alert(
        "Gallery Permission Required",
        "Please allow ORBIT to access your photos from Settings."
      );

      return null;
    }

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
    console.log("Gallery error:", error.message);

    Alert.alert(
      "Gallery Error",
      "Unable to open your photo gallery."
    );

    return null;
  }
}

// Open the device camera
async function openCamera() {
  try {
    let permission =
      await ImagePicker.getCameraPermissionsAsync();

    if (!permission.granted) {
      permission =
        await ImagePicker.requestCameraPermissionsAsync();
    }

    if (!permission.granted) {
      Alert.alert(
        "Camera Permission Required",
        "Please allow ORBIT to access your camera from Settings."
      );

      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
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
    console.log("Camera error:", error.message);

    Alert.alert(
      "Camera Error",
      "Unable to open your camera."
    );

    return null;
  }
}

// Ask the user to choose Gallery or Camera
export default function openImagePicker() {
  return new Promise((resolve) => {
    Alert.alert(
      "Attach Image",
      "Choose where you want to get your image from.",
      [
        {
          text: "Gallery",
          onPress: async () => {
            const image = await openGallery();
            resolve(image);
          },
        },
        {
          text: "Camera",
          onPress: async () => {
            const image = await openCamera();
            resolve(image);
          },
        },
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => resolve(null),
        },
      ],
      { cancelable: true }
    );
  });
}
