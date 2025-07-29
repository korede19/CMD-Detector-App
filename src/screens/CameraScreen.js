import React, { useState } from "react";
import { SafeAreaView, View, Modal, ScrollView, Alert } from "react-native";

// Import Components
import InstructionsCard from "../components/InstructionsCard";
import ImageCaptureArea from "../components/ImageCaptureArea";
import CameraActionButtons from "../components/CameraActionButtons";
import HelpSection from "../components/HelpSection";
import CameraComponent from "../components/CameraComponent";
import ImagePreview from "../components/ImagePreview";

// Import Hooks
import { useImagePicker } from "../hooks/useImagePicker";

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
    setIsAnalyzing(true);

    // Simulate API call for CMD detection
    try {
      // Here you would typically send the image to your AI model
      // For now, we'll simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Navigate to results screen (you'll need to create this)
      // navigation.navigate('Results', { imageUri: capturedImage });

      // For now, just show an alert
      Alert.alert(
        "Analysis Complete",
        "CMD detection analysis has been completed. Results would be shown here.",
        [
          {
            text: "View History",
            onPress: () => navigation.navigate("History"),
          },
          {
            text: "Scan Another",
            onPress: () => setCapturedImage(null),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to analyze image. Please try again.");
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
