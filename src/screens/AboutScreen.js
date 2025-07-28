import React from "react";
import { SafeAreaView, ScrollView } from "react-native";

// Import Components
import AboutHeader from "../components/AboutHeader";
import AboutContent from "../components/AboutContent";

// Import Styles
import { globalStyles } from "../styles/globalStyles";

export default function AboutScreen({ navigation }) {
  return (
    <SafeAreaView style={globalStyles.screenContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AboutHeader />
        <AboutContent />
      </ScrollView>
    </SafeAreaView>
  );
}
