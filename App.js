import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

// Import your screens
import CameraScreen from "./src/screens/CameraScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import ResultsScreen from "./src/screens/ResultsScreen";
import HomeScreen from "./src/screens/HomeScreen"; // We'll create this

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Camera":
              iconName = "camera-alt";
              break;
            case "History":
              iconName = "history";
              break;
            default:
              iconName = "help";
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{ tabBarLabel: "Scan" }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ tabBarLabel: "History" }}
      />
    </Tab.Navigator>
  );
}

// Main Stack Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
