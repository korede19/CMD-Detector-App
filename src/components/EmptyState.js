import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { componentStyles } from "../styles/componentStyles";

export default function EmptyState({
  iconName,
  title,
  description,
  buttonText,
  onButtonPress,
}) {
  return (
    <View style={componentStyles.emptyStateContainer}>
      <View style={componentStyles.emptyStateIcon}>
        <LinearGradient
          colors={["#E3F2FD", "#BBDEFB"]}
          style={componentStyles.emptyIconGradient}
        >
          <MaterialIcons name={iconName} size={60} color="#2196F3" />
        </LinearGradient>
      </View>
      <Text style={componentStyles.emptyStateTitle}>{title}</Text>
      <Text style={componentStyles.emptyStateText}>{description}</Text>
      <TouchableOpacity
        style={componentStyles.primaryButton}
        onPress={onButtonPress}
      >
        <LinearGradient
          colors={["#4CAF50", "#388E3C"]}
          style={componentStyles.primaryButtonGradient}
        >
          <MaterialIcons name="camera-alt" size={20} color="#fff" />
          <Text style={componentStyles.primaryButtonText}>{buttonText}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
