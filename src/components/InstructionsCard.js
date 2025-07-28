import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { componentStyles } from "../styles/componentStyles";

export default function InstructionsCard() {
  const instructions = [
    "📸 Ensure good lighting conditions",
    "🍃 Focus on the entire leaf surface",
    "🎯 Keep the leaf centered in frame",
    "⚡ Avoid shadows and motion blur",
  ];

  return (
    <View style={componentStyles.instructionsCard}>
      <MaterialIcons name="info-outline" size={24} color="#2196F3" />
      <Text style={componentStyles.instructionsTitle}>Photography Tips</Text>
      <View style={componentStyles.instructionsList}>
        {instructions.map((instruction, index) => (
          <Text key={index} style={componentStyles.instructionItem}>
            {instruction}
          </Text>
        ))}
      </View>
    </View>
  );
}
