// =============================================================================
// components/CameraComponent.js - Fixed with proper Camera import handling
// =============================================================================

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

// Import Camera with proper error handling
let Camera = null;
let CameraType = null;
let FlashMode = null;

try {
  // Try the newer import structure first
  const { CameraView } = require("expo-camera");
  Camera = CameraView;

  // For newer versions, camera types are strings
  CameraType = {
    back: "back",
    front: "front",
  };

  FlashMode = {
    off: "off",
    on: "on",
    auto: "auto",
  };
} catch (error) {
  try {
    // Fallback to older import structure
    const cameraModule = require("expo-camera");
    Camera = cameraModule.Camera;
    CameraType = cameraModule.CameraType || {
      back: "back",
      front: "front",
    };
    FlashMode = cameraModule.FlashMode || {
      off: "off",
      on: "on",
      auto: "auto",
    };
  } catch (fallbackError) {
    console.log("expo-camera not available:", fallbackError);
  }
}

const { width, height } = Dimensions.get("window");

export default function CameraComponent({ onImageCaptured, onClose }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType?.back || "back");
  const [flashMode, setFlashMode] = useState(FlashMode?.off || "off");
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    if (!Camera) {
      Alert.alert(
        "Camera Not Available",
        "expo-camera package is not installed or not compatible. Please install it with: npx expo install expo-camera",
        [{ text: "OK", onPress: onClose }]
      );
      return;
    }

    try {
      // Try to get camera permissions
      let permissionFunction;

      // Check for different permission methods
      try {
        const { Camera: CameraModule } = require("expo-camera");
        permissionFunction = CameraModule.requestCameraPermissionsAsync;
      } catch {
        const { requestCameraPermissionsAsync } = require("expo-camera");
        permissionFunction = requestCameraPermissionsAsync;
      }

      if (permissionFunction) {
        const { status } = await permissionFunction();
        setHasPermission(status === "granted");
      } else {
        throw new Error("Permission function not found");
      }
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      Alert.alert(
        "Permission Error",
        "Could not request camera permissions. Please check if expo-camera is properly installed.",
        [{ text: "OK", onPress: onClose }]
      );
      setHasPermission(false);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing && cameraReady) {
      try {
        setIsCapturing(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          exif: false,
        });

        onImageCaptured(photo.uri);
        onClose();
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert("Error", "Failed to take picture. Please try again.");
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const toggleFlash = () => {
    if (!FlashMode) return;

    setFlashMode((prevMode) =>
      prevMode === FlashMode.off ? FlashMode.on : FlashMode.off
    );
  };

  const flipCamera = () => {
    if (!CameraType) return;

    setType((prevType) =>
      prevType === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const onCameraReady = () => {
    setCameraReady(true);
  };

  // Show loading while checking permissions
  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.permissionText}>
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  // Show permission denied message
  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialIcons name="camera-alt" size={80} color="#ccc" />
        <Text style={styles.permissionText}>Camera permission denied</Text>
        <Text style={styles.permissionSubtext}>
          Please enable camera access in your device settings
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show error if Camera is not available
  if (!Camera) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialIcons name="error" size={80} color="#f44336" />
        <Text style={styles.permissionText}>Camera not available</Text>
        <Text style={styles.permissionSubtext}>
          Please install expo-camera package:{"\n"}npx expo install expo-camera
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Camera props for different versions
  const cameraProps = {
    ref: cameraRef,
    style: styles.camera,
    facing: type, // newer versions use 'facing' instead of 'type'
    flash: flashMode,
    onCameraReady: onCameraReady,
  };

  // Fallback for older versions
  if (Camera.name === "Camera") {
    cameraProps.type = type;
    cameraProps.flashMode = flashMode;
    cameraProps.ratio = "16:9";
    delete cameraProps.facing;
    delete cameraProps.flash;
  }

  return (
    <View style={styles.container}>
      <Camera {...cameraProps}>
        {/* Header Controls */}
        <View style={styles.headerControls}>
          <TouchableOpacity style={styles.controlButton} onPress={onClose}>
            <MaterialIcons name="close" size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
            <MaterialIcons
              name={
                flashMode === (FlashMode?.off || "off")
                  ? "flash-off"
                  : "flash-on"
              }
              size={28}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Camera Overlay Guidelines */}
        <View style={styles.overlay}>
          <View style={styles.guideline}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <Text style={styles.guideText}>
            Position the cassava leaf within the frame
          </Text>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.flipButton} onPress={flipCamera}>
            <MaterialIcons name="flip-camera-ios" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.captureButton,
              !cameraReady && styles.captureButtonDisabled,
            ]}
            onPress={takePicture}
            disabled={isCapturing || !cameraReady}
          >
            <LinearGradient
              colors={
                isCapturing || !cameraReady
                  ? ["#ccc", "#999"]
                  : ["#4CAF50", "#388E3C"]
              }
              style={styles.captureButtonGradient}
            >
              {isCapturing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <MaterialIcons name="camera-alt" size={32} color="#fff" />
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.flipButton} />
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    color: "#333",
    marginTop: 20,
    textAlign: "center",
  },
  permissionSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  closeButton: {
    marginTop: 30,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  headerControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  guideline: {
    width: width * 0.7,
    height: width * 0.7,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#4CAF50",
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  guideText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 30,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 40,
    paddingHorizontal: 30,
  },
  flipButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    elevation: 8,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
