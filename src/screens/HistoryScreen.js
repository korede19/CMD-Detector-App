import React from "react";
import { SafeAreaView } from "react-native";

import EmptyState from "../components/EmptyState";

import { globalStyles } from "../styles/globalStyles";

export default function HistoryScreen({ navigation }) {
  return (
    <SafeAreaView style={globalStyles.screenContainer}>
      <EmptyState
        iconName="history"
        title="No Scans Yet"
        description="Start scanning cassava leaves to see your detection history here. All your results will be saved for future reference."
        buttonText="Start First Scan"
        onButtonPress={() => navigation.navigate("Camera")}
      />
    </SafeAreaView>
  );
}
