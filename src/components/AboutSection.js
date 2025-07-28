import React from "react";
import { View, Text } from "react-native";
import { componentStyles } from "../styles/componentStyles";

export default function AboutSection({ title, children, isList = false }) {
  return (
    <View style={componentStyles.aboutSection}>
      <Text style={componentStyles.aboutSectionTitle}>{title}</Text>
      {isList ? (
        <View style={componentStyles.symptomsList}>{children}</View>
      ) : (
        children
      )}
    </View>
  );
}
