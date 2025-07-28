// App.js - Main App Entry Point
import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import Screens
import HomeScreen from "./src/screens/HomeScreen";
import CameraScreen from "./src/screens/CameraScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import AboutScreen from "./src/screens/AboutScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor="#fff" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#fff",
            elevation: 1,
            shadowOpacity: 0.1,
            borderBottomWidth: 1,
            borderBottomColor: "#E0E0E0",
          },
          headerTintColor: "#333",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            color: "#333",
          },
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ title: "Capture Leaf Image" }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: "Detection History" }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ title: "About CMD" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
