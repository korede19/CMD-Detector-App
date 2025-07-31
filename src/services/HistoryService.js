import AsyncStorage from "@react-native-async-storage/async-storage";

class HistoryService {
  constructor() {
    this.storageKey = "cassava_analysis_history";
  }

  // Save analysis result to history
  async saveAnalysis(imageUri, predictionResult) {
    try {
      const analysisRecord = {
        id: this.generateId(),
        imageUri,
        result: predictionResult,
        timestamp: new Date().toISOString(),
        location: null, // Could be added later with geolocation
      };

      const existingHistory = await this.getHistory();
      const updatedHistory = [analysisRecord, ...existingHistory];

      // Keep only the last 100 records to manage storage
      const trimmedHistory = updatedHistory.slice(0, 100);

      await AsyncStorage.setItem(
        this.storageKey,
        JSON.stringify(trimmedHistory)
      );
      return analysisRecord;
    } catch (error) {
      console.error("Error saving analysis to history:", error);
      throw new Error("Failed to save analysis to history");
    }
  }

  // Get all history records
  async getHistory() {
    try {
      const historyData = await AsyncStorage.getItem(this.storageKey);
      return historyData ? JSON.parse(historyData) : [];
    } catch (error) {
      console.error("Error retrieving history:", error);
      return [];
    }
  }

  // Get specific analysis by ID
  async getAnalysisById(id) {
    try {
      const history = await this.getHistory();
      return history.find((record) => record.id === id);
    } catch (error) {
      console.error("Error retrieving analysis by ID:", error);
      return null;
    }
  }

  // Delete specific analysis
  async deleteAnalysis(id) {
    try {
      const history = await this.getHistory();
      const updatedHistory = history.filter((record) => record.id !== id);
      await AsyncStorage.setItem(
        this.storageKey,
        JSON.stringify(updatedHistory)
      );
      return true;
    } catch (error) {
      console.error("Error deleting analysis:", error);
      return false;
    }
  }

  // Clear all history
  async clearHistory() {
    try {
      await AsyncStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error("Error clearing history:", error);
      return false;
    }
  }

  // Get statistics
  async getStatistics() {
    try {
      const history = await this.getHistory();

      const stats = {
        totalAnalyses: history.length,
        diseaseDistribution: {},
        recentActivity: history.slice(0, 10),
        monthlyAnalyses: this.getMonthlyAnalyses(history),
      };

      // Count disease occurrences
      history.forEach((record) => {
        const diseaseName = record.result.primaryDisease.name;
        stats.diseaseDistribution[diseaseName] =
          (stats.diseaseDistribution[diseaseName] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error("Error calculating statistics:", error);
      return {
        totalAnalyses: 0,
        diseaseDistribution: {},
        recentActivity: [],
        monthlyAnalyses: [],
      };
    }
  }

  // Helper: Get monthly analysis counts
  getMonthlyAnalyses(history) {
    const monthlyData = {};

    history.forEach((record) => {
      const date = new Date(record.timestamp);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([month, count]) => ({ month, count }));
  }

  // Helper: Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Search history
  async searchHistory(query) {
    try {
      const history = await this.getHistory();
      const lowerQuery = query.toLowerCase();

      return history.filter((record) => {
        const diseaseName = record.result.primaryDisease.name.toLowerCase();
        const date = new Date(record.timestamp).toDateString().toLowerCase();

        return diseaseName.includes(lowerQuery) || date.includes(lowerQuery);
      });
    } catch (error) {
      console.error("Error searching history:", error);
      return [];
    }
  }

  // Export history data
  async exportHistory() {
    try {
      const history = await this.getHistory();
      const exportData = {
        exportDate: new Date().toISOString(),
        totalRecords: history.length,
        data: history.map((record) => ({
          ...record,
          imageUri: "IMAGE_DATA_REMOVED_FOR_EXPORT", // Remove image data for smaller export
        })),
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error("Error exporting history:", error);
      throw new Error("Failed to export history data");
    }
  }
}

export default new HistoryService();
