import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";

// Import Components
import Header from "../components/Header";
import MainActionCard from "../components/MainActionCard";
import FeaturesSection from "../components/FeatureSection";
import QuickActionsSection from "../components/QuickActionsSection";
import StatsSection from "../components/StatsSection";

// Import Styles
import { globalStyles } from "../styles/globalStyles";

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={globalStyles.scrollView}
      >
        <Header />
        <MainActionCard navigation={navigation} />
        <FeaturesSection />
        <QuickActionsSection navigation={navigation} />
        <StatsSection />
      </ScrollView>
      <StatusBar style="dark" backgroundColor="#fff" />
    </SafeAreaView>
  );
}
