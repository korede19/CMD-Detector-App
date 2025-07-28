import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import AboutSection from "./AboutSection";
import { componentStyles } from "../styles/componentStyles";

export default function AboutContent() {
  const symptoms = [
    "• Yellow and green mosaic patterns on leaves",
    "• Stunted plant growth and development",
    "• Curling and distortion of leaves",
    "• Reduced tuber yield at harvest",
  ];

  const prevention = [
    "• Use CMD-resistant cassava varieties",
    "• Control whitefly populations",
    "• Remove infected plants early",
    "• Use clean planting materials",
  ];

  return (
    <View style={componentStyles.aboutContent}>
      <AboutSection title="What is CMD?">
        <Text style={componentStyles.aboutText}>
          Cassava Mosaic Disease (CMD) is a viral disease that affects cassava
          plants, one of the most important food crops in Africa. The disease is
          caused by several species of begomovirus and is transmitted primarily
          by whiteflies.
        </Text>
      </AboutSection>

      <AboutSection title="🔍 Key Symptoms" isList={true}>
        {symptoms.map((symptom, index) => (
          <Text key={index} style={componentStyles.symptomItem}>
            {symptom}
          </Text>
        ))}
      </AboutSection>

      <AboutSection title="🛡️ Prevention" isList={true}>
        {prevention.map((item, index) => (
          <Text key={index} style={componentStyles.symptomItem}>
            {item}
          </Text>
        ))}
      </AboutSection>

      <View style={componentStyles.impactCard}>
        <LinearGradient
          colors={["#2196F3", "#42A5F5"]}
          style={componentStyles.impactGradient}
        >
          <MaterialIcons name="psychology" size={32} color="#fff" />
          <Text style={componentStyles.impactTitle}>AI-Powered Solution</Text>
          <Text style={componentStyles.impactText}>
            Our advanced AI model can detect CMD with over 95% accuracy, helping
            farmers identify the disease early and take appropriate action.
          </Text>
        </LinearGradient>
      </View>
    </View>
  );
}
