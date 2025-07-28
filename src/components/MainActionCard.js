import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { componentStyles } from "../styles/componentStyles";

export default function MainActionCard({ navigation }) {
  return (
    <View style={componentStyles.mainActionCard}>
      <View style={componentStyles.actionCardContent}>
        <MaterialIcons name="camera-alt" size={48} color="#4CAF50" />
        <Text style={componentStyles.actionCardTitle}>Ready to Scan?</Text>
        <Text style={componentStyles.actionCardSubtitle}>
          Take a photo of your cassava leaf to detect CMD instantly
        </Text>

        <TouchableOpacity
          style={componentStyles.scanButton}
          onPress={() => navigation.navigate("Camera")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#4CAF50", "#388E3C"]}
            style={componentStyles.scanButtonGradient}
          >
            <MaterialIcons name="camera-alt" size={24} color="#fff" />
            <Text style={componentStyles.scanButtonText}>Start Scanning</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
