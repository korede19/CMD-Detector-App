import React from "react";
import { SafeAreaView, ScrollView } from "react-native";

// Import Components
import InstructionsCard from "../components/InstructionsCard";
import ImageCaptureArea from "../components/ImageCaptureArea";
import CameraActionButtons from "../components/CameraActionButtons";
import HelpSection from "../components/HelpSection";

// Import Styles
import { globalStyles } from "../styles/globalStyles";

export default function CameraScreen({ navigation }) {
  return (
    <SafeAreaView style={globalStyles.screenContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <InstructionsCard />
        <ImageCaptureArea />
        <CameraActionButtons />
        <HelpSection />
      </ScrollView>
    </SafeAreaView>
  );
}
