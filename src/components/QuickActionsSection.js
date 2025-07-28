import React from "react";
import { View, Text } from "react-native";
import QuickActionCard from "./QuickActionCard";
import { componentStyles } from "../styles/componentStyles";

export default function QuickActionsSection({ navigation }) {
  return (
    <View style={componentStyles.quickActionsSection}>
      <Text style={componentStyles.sectionTitle}>Quick Actions</Text>
      <View style={componentStyles.quickActionsGrid}>
        <QuickActionCard
          iconName="time-outline"
          iconColor="#4CAF50"
          title="History"
          description="View past scans"
          onPress={() => navigation.navigate("History")}
        />
        <QuickActionCard
          iconName="information-circle-outline"
          iconColor="#2196F3"
          title="Learn"
          description="About CMD"
          onPress={() => navigation.navigate("About")}
        />
      </View>
    </View>
  );
}
