import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { componentStyles } from "../styles/componentStyles";

export default function ImageCaptureArea() {
  return (
    <View style={componentStyles.captureSection}>
      <View style={componentStyles.imageContainer}>
        <View style={componentStyles.placeholder}>
          <View style={componentStyles.placeholderIcon}>
            <MaterialIcons name="add-a-photo" size={60} color="#E0E0E0" />
          </View>
          <Text style={componentStyles.placeholderText}>
            Select or capture a leaf image
          </Text>
          <Text style={componentStyles.placeholderSubtext}>
            Upload from gallery or take a new photo
          </Text>
        </View>
      </View>
    </View>
  );
}
