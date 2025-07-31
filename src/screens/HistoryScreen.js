import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  RefreshControl,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import HistoryService from "../services/HistoryService";

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showStats, setShowStats] = useState(false);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    loadHistory();
    loadStatistics();
  }, []);

  useEffect(() => {
    filterHistory();
  }, [history, searchQuery]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const historyData = await HistoryService.getHistory();
      setHistory(historyData);
    } catch (error) {
      Alert.alert("Error", "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await HistoryService.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error("Failed to load statistics:", error);
    }
  };

  const filterHistory = () => {
    if (!searchQuery) {
      setFilteredHistory(history);
      return;
    }

    const filtered = history.filter((item) => {
      const diseaseName = item.result.primaryDisease.name.toLowerCase();
      const date = new Date(item.timestamp).toDateString().toLowerCase();
      const query = searchQuery.toLowerCase();

      return diseaseName.includes(query) || date.includes(query);
    });

    setFilteredHistory(filtered);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHistory();
    await loadStatistics();
    setRefreshing(false);
  }, []);

  const deleteItem = async (id) => {
    Alert.alert(
      "Delete Analysis",
      "Are you sure you want to delete this analysis?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await HistoryService.deleteAnalysis(id);
            if (success) {
              loadHistory();
              loadStatistics();
            } else {
              Alert.alert("Error", "Failed to delete analysis");
            }
          },
        },
      ]
    );
  };

  const clearAllHistory = () => {
    Alert.alert(
      "Clear All History",
      "Are you sure you want to delete all analysis history? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            const success = await HistoryService.clearHistory();
            if (success) {
              setHistory([]);
              setStatistics(null);
              Alert.alert("Success", "All history cleared");
            } else {
              Alert.alert("Error", "Failed to clear history");
            }
          },
        },
      ]
    );
  };

  const exportHistory = async () => {
    try {
      await HistoryService.exportHistory();
      // In a real app, you might save this to a file or share it
      Alert.alert(
        "Export Ready",
        "History data has been prepared for export. In a full implementation, this would be saved to a file.",
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to export history");
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

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() =>
        navigation.navigate("Results", {
          imageUri: item.imageUri,
          predictionResult: item.result,
        })
      }
    >
      <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />

      <View style={styles.itemContent}>
        <Text style={styles.diseaseName} numberOfLines={1}>
          {item.result.primaryDisease.name}
        </Text>
        <Text style={styles.confidence}>
          Confidence: {(item.result.primaryDisease.confidence * 100).toFixed(1)}
          %
        </Text>
        <Text style={styles.date}>
          {new Date(item.timestamp).toLocaleDateString()}{" "}
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>

        <View
          style={[
            styles.severityBadge,
            {
              backgroundColor: getSeverityColor(
                item.result.primaryDisease.severity
              ),
            },
          ]}
        >
          <Text style={styles.severityText}>
            {item.result.primaryDisease.severity}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteItem(item.id)}
      >
        <MaterialIcons name="delete" size={20} color="#f44336" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialIcons name="history" size={80} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No Analysis History</Text>
      <Text style={styles.emptyStateText}>
        Start analyzing cassava leaves to build your history
      </Text>
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => navigation.navigate("Camera")}
      >
        <LinearGradient
          colors={["#4CAF50", "#388E3C"]}
          style={styles.scanButtonGradient}
        >
          <MaterialIcons name="camera-alt" size={24} color="#fff" />
          <Text style={styles.scanButtonText}>Start Scanning</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderStatisticsModal = () => (
    <Modal
      visible={showStats}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Statistics</Text>
          <TouchableOpacity onPress={() => setShowStats(false)}>
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {statistics && (
          <View style={styles.statsContent}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{statistics.totalAnalyses}</Text>
              <Text style={styles.statLabel}>Total Analyses</Text>
            </View>

            <Text style={styles.statsSection}>Disease Distribution</Text>
            {Object.entries(statistics.diseaseDistribution).map(
              ([disease, count]) => (
                <View key={disease} style={styles.diseaseStatItem}>
                  <Text style={styles.diseaseStatName}>{disease}</Text>
                  <Text style={styles.diseaseStatCount}>{count}</Text>
                </View>
              )
            )}
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis History</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowStats(true)}
          >
            <MaterialIcons name="bar-chart" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={exportHistory}>
            <MaterialIcons name="file-download" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by disease name or date"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <MaterialIcons name="clear" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* History List */}
      {loading ? (
        <View style={styles.emptyState}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={
            filteredHistory.length === 0 && styles.emptyContainer
          }
        />
      )}

      {/* Clear History Button */}
      {history.length > 0 && (
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearAllHistory}
          >
            <MaterialIcons name="delete-sweep" size={20} color="#f44336" />
            <Text style={styles.clearButtonText}>Clear All History</Text>
          </TouchableOpacity>
        </View>
      )}

      {renderStatisticsModal()}
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
  headerActions: {
    flexDirection: "row",
  },
  headerButton: {
    marginLeft: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  historyItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    alignItems: "center",
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemContent: {
    flex: 1,
    marginLeft: 15,
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  confidence: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  severityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  severityText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  deleteButton: {
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  scanButton: {
    borderRadius: 15,
    elevation: 5,
  },
  scanButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  bottomActions: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  clearButtonText: {
    color: "#f44336",
    fontSize: 16,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    elevation: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statsContent: {
    padding: 20,
  },
  statCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    alignItems: "center",
    marginBottom: 20,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  statLabel: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  statsSection: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  diseaseStatItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  diseaseStatName: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  diseaseStatCount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
  },
});
