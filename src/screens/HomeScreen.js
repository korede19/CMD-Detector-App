import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import HistoryService from "../services/HistoryService";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    loadData();

    // Refresh data when screen comes into focus
    const unsubscribe = navigation.addListener("focus", loadData);
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      const [history, stats] = await Promise.all([
        HistoryService.getHistory(),
        HistoryService.getStatistics(),
      ]);

      setRecentAnalyses(history.slice(0, 3)); // Get last 3 analyses
      setStatistics(stats);
    } catch (error) {
      console.error("Error loading home data:", error);
    }
  };

  const getDiseaseIcon = (diseaseName) => {
    if (diseaseName.toLowerCase().includes("healthy")) return "check-circle";
    if (diseaseName.toLowerCase().includes("mosaic")) return "bug-report";
    if (diseaseName.toLowerCase().includes("streak")) return "warning";
    if (diseaseName.toLowerCase().includes("mite")) return "pest-control";
    return "local-hospital";
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "#f44336";
      case "moderate":
        return "#ff9800";
      case "low":
        return "#ffeb3b";
      case "none":
        return "#4caf50";
      default:
        return "#9e9e9e";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.appTitle}>Cassava Disease Detector</Text>
          </View>
          <MaterialIcons name="eco" size={40} color="#4CAF50" />
        </View>

        {/* Quick Stats */}
        {statistics && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <MaterialIcons name="analytics" size={32} color="#4CAF50" />
              <Text style={styles.statNumber}>{statistics.totalAnalyses}</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialIcons name="history" size={32} color="#2196F3" />
              <Text style={styles.statNumber}>{recentAnalyses.length}</Text>
              <Text style={styles.statLabel}>Recent</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialIcons
                name="health-and-safety"
                size={32}
                color="#FF9800"
              />
              <Text style={styles.statNumber}>
                {Object.keys(statistics.diseaseDistribution).length}
              </Text>
              <Text style={styles.statLabel}>Disease Types</Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.primaryAction}
            onPress={() => navigation.navigate("Camera")}
          >
            <LinearGradient
              colors={["#4CAF50", "#388E3C"]}
              style={styles.primaryActionGradient}
            >
              <MaterialIcons name="camera-alt" size={32} color="#fff" />
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Start New Scan</Text>
                <Text style={styles.actionSubtitle}>
                  Analyze cassava leaf health
                </Text>
              </View>
              <MaterialIcons name="arrow-forward" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity
              style={styles.secondaryAction}
              onPress={() => navigation.navigate("History")}
            >
              <MaterialIcons name="history" size={24} color="#4CAF50" />
              <Text style={styles.secondaryActionText}>View History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryAction}
              onPress={() => {
                // Navigate to camera with gallery option
                navigation.navigate("Camera");
              }}
            >
              <MaterialIcons name="photo-library" size={24} color="#4CAF50" />
              <Text style={styles.secondaryActionText}>From Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Analyses */}
        {recentAnalyses.length > 0 && (
          <View style={styles.recentContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Analyses</Text>
              <TouchableOpacity onPress={() => navigation.navigate("History")}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {recentAnalyses.map((analysis, index) => (
              <TouchableOpacity
                key={analysis.id}
                style={styles.recentItem}
                onPress={() =>
                  navigation.navigate("Results", {
                    imageUri: analysis.imageUri,
                    predictionResult: analysis.result,
                  })
                }
              >
                <Image
                  source={{ uri: analysis.imageUri }}
                  style={styles.recentImage}
                />

                <View style={styles.recentContent}>
                  <View style={styles.recentHeader}>
                    <MaterialIcons
                      name={getDiseaseIcon(analysis.result.primaryDisease.name)}
                      size={20}
                      color={getSeverityColor(
                        analysis.result.primaryDisease.severity
                      )}
                    />
                    <Text style={styles.recentDisease} numberOfLines={1}>
                      {analysis.result.primaryDisease.name}
                    </Text>
                  </View>

                  <Text style={styles.recentConfidence}>
                    {(analysis.result.primaryDisease.confidence * 100).toFixed(
                      1
                    )}
                    % confidence
                  </Text>

                  <Text style={styles.recentDate}>
                    {new Date(analysis.timestamp).toLocaleDateString()}
                  </Text>
                </View>

                <MaterialIcons name="chevron-right" size={24} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Getting Started (if no analyses yet) */}
        {recentAnalyses.length === 0 && (
          <View style={styles.gettingStartedContainer}>
            <MaterialIcons name="info-outline" size={48} color="#4CAF50" />
            <Text style={styles.gettingStartedTitle}>Getting Started</Text>
            <Text style={styles.gettingStartedText}>
              Take a photo of a cassava leaf to get started with disease
              detection and analysis.
            </Text>

            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Tips for best results:</Text>
              <View style={styles.tip}>
                <MaterialIcons name="check" size={16} color="#4CAF50" />
                <Text style={styles.tipText}>Ensure good lighting</Text>
              </View>
              <View style={styles.tip}>
                <MaterialIcons name="check" size={16} color="#4CAF50" />
                <Text style={styles.tipText}>Focus on leaf details</Text>
              </View>
              <View style={styles.tip}>
                <MaterialIcons name="check" size={16} color="#4CAF50" />
                <Text style={styles.tipText}>Avoid blurry images</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: "#666",
  },
  appTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: "#fff",
    flex: 1,
    marginHorizontal: 5,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  primaryAction: {
    borderRadius: 15,
    elevation: 5,
    marginBottom: 15,
  },
  primaryActionGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 15,
  },
  actionText: {
    flex: 1,
    marginLeft: 15,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  actionSubtitle: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
    marginTop: 2,
  },
  secondaryActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  secondaryAction: {
    backgroundColor: "#fff",
    flex: 1,
    marginHorizontal: 5,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    elevation: 3,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 10,
  },
  recentContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  recentItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  recentImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  recentContent: {
    flex: 1,
    marginLeft: 15,
  },
  recentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  recentDisease: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  recentConfidence: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  recentDate: {
    fontSize: 12,
    color: "#999",
  },
  gettingStartedContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    elevation: 3,
    marginBottom: 30,
  },
  gettingStartedTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
    marginBottom: 10,
  },
  gettingStartedText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  tipsContainer: {
    alignSelf: "stretch",
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  tip: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
  },
});
