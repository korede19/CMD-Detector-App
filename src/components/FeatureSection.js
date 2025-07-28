import React from "react";
import { View, Text } from "react-native";
import FeatureCard from "./FeatureCard";
import { componentStyles } from "../styles/componentStyles";

export default function FeaturesSection() {
  const features = [
    {
      iconName: "psychology",
      gradientColors: ["#2196F3", "#42A5F5"],
      title: "AI-Powered Detection",
      description:
        "Advanced machine learning algorithms detect CMD with 95% accuracy",
    },
    {
      iconName: "speed",
      gradientColors: ["#FF9800", "#FFB74D"],
      title: "Instant Results",
      description: "Get detection results in seconds with detailed analysis",
    },
    {
      iconName: "eco",
      gradientColors: ["#9C27B0", "#BA68C8"],
      title: "Plant Health Insights",
      description: "Comprehensive leaf health analysis and recommendations",
    },
  ];

  return (
    <View style={componentStyles.featuresSection}>
      <Text style={componentStyles.sectionTitle}>Why Choose Our App?</Text>
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          iconName={feature.iconName}
          gradientColors={feature.gradientColors}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </View>
  );
}
