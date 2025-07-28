import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { componentStyles } from "../styles/componentStyles";

export default function Header() {
  return (
    <View style={componentStyles.header}>
      <View style={componentStyles.logoSection}>
        <View style={componentStyles.logoContainer}>
          <LinearGradient
            colors={["#4CAF50", "#66BB6A"]}
            style={componentStyles.logoGradient}
          >
            <MaterialIcons name="eco" size={40} color="#fff" />
          </LinearGradient>
        </View>
        <Text style={componentStyles.appName}>CMD Detector</Text>
        <Text style={componentStyles.tagline}>
          AI-Powered Cassava Disease Detection
        </Text>
      </View>
    </View>
  );
}
