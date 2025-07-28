import React from "react";
import { View, Text } from "react-native";
import { componentStyles } from "../styles/componentStyles";

export default function HelpSection() {
  return (
    <View style={componentStyles.helpSection}>
      <Text style={componentStyles.helpTitle}>Need Help?</Text>
      <Text style={componentStyles.helpText}>
        For best results, capture clear images of cassava leaves in natural
        lighting. The AI works best with close-up shots showing leaf details.
      </Text>
    </View>
  );
}
