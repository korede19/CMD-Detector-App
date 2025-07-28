import React from "react";
import { View, Text } from "react-native";
import { componentStyles } from "../styles/componentStyles";

export default function StatCard({ number, label }) {
  return (
    <View style={componentStyles.statCard}>
      <Text style={componentStyles.statNumber}>{number}</Text>
      <Text style={componentStyles.statLabel}>{label}</Text>
    </View>
  );
}
