import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { componentStyles } from "../styles/componentStyles";

export default function AboutHeader() {
  return (
    <View style={componentStyles.aboutHeader}>
      <View style={componentStyles.aboutIcon}>
        <LinearGradient
          colors={["#4CAF50", "#66BB6A"]}
          style={componentStyles.aboutIconGradient}
        >
          <MaterialIcons name="eco" size={40} color="#fff" />
        </LinearGradient>
      </View>
      <Text style={componentStyles.aboutTitle}>Cassava Mosaic Disease</Text>
      <Text style={componentStyles.aboutSubtitle}>
        Understanding CMD and Its Impact
      </Text>
    </View>
  );
}
