import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export const useImagePicker = () => {
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant permission to access your photo library",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return null;

      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets?.[0]) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image from gallery");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pickImageFromGallery,
    isLoading,
  };
};
