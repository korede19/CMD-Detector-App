import React, { useState } from "react";
import { SafeAreaView, View, Modal, ScrollView, Alert } from "react-native";

// Import Components
import InstructionsCard from "../components/InstructionsCard";
import ImageCaptureArea from "../components/ImageCaptureArea";
import CameraActionButtons from "../components/CameraActionButtons";
import HelpSection from "../components/HelpSection";
import CameraComponent from "../components/CameraComponent";
import ImagePreview from "../components/ImagePreview";

// Import Hooks and Services
import { useImagePicker } from "../hooks/useImagePicker";
import ModelService from "../services/ModelService";

// Import Styles
import { globalStyles } from "../styles/globalStyles";

export default function CameraScreen({ navigation }) {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { pickImageFromGallery, isLoading } = useImagePicker();

  const handleCameraPress = () => {
    setShowCamera(true);
  };

  const handleGalleryPress = async () => {
    const imageUri = await pickImageFromGallery();
    if (imageUri) {
      setCapturedImage(imageUri);
    }
  };

  const handleImageCaptured = (uri) => {
    setCapturedImage(uri);
    setShowCamera(false);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setShowCamera(false);
  };

  const handleAnalyze = async () => {
    if (!capturedImage) {
      Alert.alert("Error", "No image to analyze");
      return;
    }

    setIsAnalyzing(true);

    try {
      // Use the ModelService to predict disease
      const predictionResult = await ModelService.predictDisease(capturedImage);

      // Navigate to results screen with the prediction
      navigation.navigate("Results", {
        imageUri: capturedImage,
        predictionResult: predictionResult,
      });

      // Reset state
      setCapturedImage(null);
    } catch (error) {
      console.error("Analysis error:", error);
      Alert.alert(
        "Analysis Failed",
        error.message || "Failed to analyze image. Please try again.",
        [
          {
            text: "Retry",
            onPress: () => setIsAnalyzing(false),
          },
          {
            text: "Take New Photo",
            onPress: () => {
              setCapturedImage(null);
              setIsAnalyzing(false);
            },
          },
        ]
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Show image preview if image is captured
  if (capturedImage) {
    return (
      <SafeAreaView style={globalStyles.screenContainer}>
        <ImagePreview
          imageUri={capturedImage}
          onRetake={handleRetake}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.screenContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <InstructionsCard />
        <ImageCaptureArea />
        <CameraActionButtons
          onCameraPress={handleCameraPress}
          onGalleryPress={handleGalleryPress}
          isLoading={isLoading}
        />
        <HelpSection />
      </ScrollView>

      {/* Camera Modal */}
      <Modal
        visible={showCamera}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <CameraComponent
          onImageCaptured={handleImageCaptured}
          onClose={() => setShowCamera(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}
