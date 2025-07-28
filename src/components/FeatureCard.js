import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { componentStyles } from "../styles/componentStyles";

export default function FeatureCard({
  iconName,
  gradientColors,
  title,
  description,
}) {
  return (
    <View style={componentStyles.featureCard}>
      <View style={componentStyles.featureIconWrapper}>
        <LinearGradient
          colors={gradientColors}
          style={componentStyles.featureIconContainer}
        >
          <MaterialIcons name={iconName} size={24} color="#fff" />
        </LinearGradient>
      </View>
      <View style={componentStyles.featureContent}>
        <Text style={componentStyles.featureTitle}>{title}</Text>
        <Text style={componentStyles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}
