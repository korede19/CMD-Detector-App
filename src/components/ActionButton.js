import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { componentStyles } from "../styles/componentStyles";

export default function ActionButton({
  style,
  gradientColors,
  iconName,
  iconColor = "#fff",
  text,
  textStyle,
  onPress,
  isGradient = false,
}) {
  if (isGradient) {
    return (
      <TouchableOpacity style={style} onPress={onPress}>
        <LinearGradient
          colors={gradientColors}
          style={componentStyles.buttonGradient}
        >
          <MaterialIcons name={iconName} size={24} color={iconColor} />
          <Text style={textStyle}>{text}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <MaterialIcons name={iconName} size={24} color={iconColor} />
      <Text style={textStyle}>{text}</Text>
    </TouchableOpacity>
  );
}
