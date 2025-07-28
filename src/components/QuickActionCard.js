import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { componentStyles } from "../styles/componentStyles";

export default function QuickActionCard({
  iconName,
  iconColor,
  title,
  description,
  onPress,
}) {
  return (
    <TouchableOpacity style={componentStyles.quickActionCard} onPress={onPress}>
      <View style={componentStyles.quickActionIcon}>
        <Ionicons name={iconName} size={28} color={iconColor} />
      </View>
      <Text style={componentStyles.quickActionTitle}>{title}</Text>
      <Text style={componentStyles.quickActionDesc}>{description}</Text>
    </TouchableOpacity>
  );
}
