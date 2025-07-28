import React from "react";
import { View } from "react-native";
import ActionButton from "./ActionButton";
import { componentStyles } from "../styles/componentStyles";

export default function CameraActionButtons() {
  return (
    <View style={componentStyles.actionSection}>
      <View style={componentStyles.buttonRow}>
        <ActionButton
          style={componentStyles.cameraButton}
          gradientColors={["#4CAF50", "#388E3C"]}
          iconName="camera-alt"
          text="Camera"
          textStyle={componentStyles.buttonText}
          isGradient={true}
        />
        <ActionButton
          style={componentStyles.galleryButton}
          iconName="photo-library"
          iconColor="#4CAF50"
          text="Gallery"
          textStyle={componentStyles.galleryButtonText}
        />
      </View>

      <ActionButton
        style={componentStyles.analyzeButton}
        gradientColors={["#FF9800", "#F57C00"]}
        iconName="psychology"
        text="Analyze Leaf"
        textStyle={componentStyles.analyzeButtonText}
        isGradient={true}
      />
    </View>
  );
}
