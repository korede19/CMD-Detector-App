import React from "react";
import { View, Text } from "react-native";
import StatCard from "./StatCard";
import { componentStyles } from "../styles/componentStyles";

export default function StatsSection() {
  const stats = [
    { number: "95%", label: "Accuracy" },
    { number: "1K+", label: "Scans" },
    { number: "24/7", label: "Available" },
  ];

  return (
    <View style={componentStyles.statsSection}>
      <Text style={componentStyles.sectionTitle}>App Statistics</Text>
      <View style={componentStyles.statsGrid}>
        {stats.map((stat, index) => (
          <StatCard key={index} number={stat.number} label={stat.label} />
        ))}
      </View>
    </View>
  );
}
