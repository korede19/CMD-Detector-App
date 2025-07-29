// =============================================================================
// components/ImagePreview.js - Fixed with ActivityIndicator import
// =============================================================================

import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator, // Added missing import
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function ImagePreview({
  imageUri,
  onRetake,
  onAnalyze,
  isAnalyzing,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />

        {/* Image Overlay */}
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.retakeButton} onPress={onRetake}>
            <MaterialIcons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <Text style={styles.title}>Image Captured!</Text>
        <Text style={styles.subtitle}>
          Review your image and proceed with analysis
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.retakeButtonFull} onPress={onRetake}>
            <MaterialIcons name="camera-alt" size={24} color="#4CAF50" />
            <Text style={styles.retakeButtonText}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={onAnalyze}
            disabled={isAnalyzing}
          >
            <LinearGradient
              colors={isAnalyzing ? ["#ccc", "#999"] : ["#FF9800", "#F57C00"]}
              style={styles.analyzeButtonGradient}
            >
              {isAnalyzing ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.analyzeButtonText}>Analyzing...</Text>
                </>
              ) : (
                <>
                  <MaterialIcons name="psychology" size={24} color="#fff" />
                  <Text style={styles.analyzeButtonText}>Analyze Leaf</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  imageContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  retakeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  retakeButtonFull: {
    flex: 0.45,
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
  retakeButtonText: {
    color: "#4CAF50",
    marginLeft: 8,
    fontWeight: "bold",
    fontSize: 16,
  },
  analyzeButton: {
    flex: 0.5,
    borderRadius: 15,
    elevation: 5,
  },
  analyzeButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 15,
  },
  analyzeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
