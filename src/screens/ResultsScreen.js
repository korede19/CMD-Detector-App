import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import ModelService from "../services/ModelService";
import HistoryService from "../services/HistoryService";

const { width } = Dimensions.get("window");

export default function ResultsScreen({ route, navigation }) {
  const { imageUri, predictionResult } = route.params;
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    // Load recommendations for the detected disease
    const recs = ModelService.getDiseaseRecommendations(
      predictionResult.primaryDisease.name
    );
    setRecommendations(recs);

    // Save to history
    saveToHistory();
  }, []);

  const saveToHistory = async () => {
    try {
      await HistoryService.saveAnalysis(imageUri, predictionResult);
    } catch (error) {
      console.error("Failed to save to history:", error);
    }
  };

  const handleShare = async () => {
    try {
      const result = predictionResult.primaryDisease;
      const shareContent = {
        message: `Cassava Analysis Result:
Disease: ${result.name}
Confidence: ${(result.confidence * 100).toFixed(1)}%
Severity: ${result.severity}
Date: ${new Date(predictionResult.analysisDate).toLocaleDateString()}

Analyzed with Cassava Disease Detector App`,
      };

      await Share.share(shareContent);
    } catch (error) {
      console.error("Error sharing result:", error);
    }
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

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "high":
        return "error";
      case "moderate":
        return "warning";
      case "low":
        return "info";
      case "none":
        return "check-circle";
      default:
        return "help";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analysis Results</Text>
          <TouchableOpacity onPress={handleShare}>
            <MaterialIcons name="share" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Image Display */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>

        {/* Primary Result */}
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <MaterialIcons
              name={getSeverityIcon(predictionResult.primaryDisease.severity)}
              size={32}
              color={getSeverityColor(predictionResult.primaryDisease.severity)}
            />
            <View style={styles.resultText}>
              <Text style={styles.diseaseName}>
                {predictionResult.primaryDisease.name}
              </Text>
              <Text style={styles.confidence}>
                Confidence:{" "}
                {(predictionResult.primaryDisease.confidence * 100).toFixed(1)}%
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.severityBadge,
              {
                backgroundColor: getSeverityColor(
                  predictionResult.primaryDisease.severity
                ),
              },
            ]}
          >
            <Text style={styles.severityText}>
              {predictionResult.primaryDisease.severity.toUpperCase()} SEVERITY
            </Text>
          </View>

          <Text style={styles.description}>
            {predictionResult.primaryDisease.description}
          </Text>
        </View>

        {/* All Predictions */}
        <View style={styles.allPredictionsCard}>
          <Text style={styles.sectionTitle}>All Detections</Text>
          {predictionResult.allPredictions
            .slice(0, 4)
            .map((prediction, index) => (
              <View key={index} style={styles.predictionItem}>
                <Text style={styles.predictionName}>{prediction.name}</Text>
                <View style={styles.confidenceBar}>
                  <View
                    style={[
                      styles.confidenceProgress,
                      { width: `${prediction.confidence * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.predictionConfidence}>
                  {(prediction.confidence * 100).toFixed(1)}%
                </Text>
              </View>
            ))}
        </View>

        {/* Recommendations */}
        {recommendations && (
          <View style={styles.recommendationsCard}>
            <Text style={styles.sectionTitle}>Recommendations</Text>

            <View style={styles.recommendationSection}>
              <Text style={styles.recommendationTitle}>Treatment</Text>
              {recommendations.treatment.map((item, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <MaterialIcons
                    name="medical-services"
                    size={16}
                    color="#4caf50"
                  />
                  <Text style={styles.recommendationText}>{item}</Text>
                </View>
              ))}
            </View>

            <View style={styles.recommendationSection}>
              <Text style={styles.recommendationTitle}>Prevention</Text>
              {recommendations.prevention.map((item, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <MaterialIcons name="shield" size={16} color="#2196f3" />
                  <Text style={styles.recommendationText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={() =>
              navigation.navigate("MainTabs", { screen: "Camera" })
            }
          >
            <LinearGradient
              colors={["#4CAF50", "#388E3C"]}
              style={styles.buttonGradient}
            >
              <MaterialIcons name="camera-alt" size={24} color="#fff" />
              <Text style={styles.buttonText}>Scan Another</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={() =>
              navigation.navigate("MainTabs", { screen: "History" })
            }
          >
            <MaterialIcons name="history" size={24} color="#4CAF50" />
            <Text style={styles.historyButtonText}>View History</Text>
          </TouchableOpacity>
        </View>
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
    paddingVertical: 15,
    backgroundColor: "#fff",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  imageContainer: {
    margin: 20,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 200,
  },
  resultCard: {
    backgroundColor: "#fff",
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  resultText: {
    marginLeft: 15,
    flex: 1,
  },
  diseaseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  confidence: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  severityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15,
  },
  severityText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  allPredictionsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  predictionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  predictionName: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  confidenceBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  confidenceProgress: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  predictionConfidence: {
    fontSize: 12,
    color: "#666",
    minWidth: 40,
    textAlign: "right",
  },
  recommendationsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  recommendationSection: {
    marginBottom: 20,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
    lineHeight: 20,
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  scanAgainButton: {
    borderRadius: 15,
    elevation: 5,
    marginBottom: 15,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  historyButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 15,
    elevation: 3,
  },
  historyButtonText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
