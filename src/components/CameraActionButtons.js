import React from "react";
import { View, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { componentStyles } from "../styles/componentStyles";

export default function CameraActionButtons({
  onCameraPress,
  onGalleryPress,
  isLoading,
}) {
  return (
    <View style={componentStyles.actionSection}>
      <View style={componentStyles.buttonRow}>
        <TouchableOpacity
          style={componentStyles.cameraButton}
          onPress={onCameraPress}
        >
          <LinearGradient
            colors={["#4CAF50", "#388E3C"]}
            style={componentStyles.buttonGradient}
          >
            <MaterialIcons name="camera-alt" size={24} color="#fff" />
            <Text style={componentStyles.buttonText}>Camera</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={componentStyles.galleryButton}
          onPress={onGalleryPress}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#4CAF50" />
          ) : (
            <MaterialIcons name="photo-library" size={24} color="#4CAF50" />
          )}
          <Text style={componentStyles.galleryButtonText}>
            {isLoading ? "Loading..." : "Gallery"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
