import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function DirectoryScreen() {
  const lawyers = [
    {
      id: 1,
      name: "Advocate Raj Kumar",
      specialization: "Criminal Law",
      rating: 4.8,
      experience: "15 years",
    },
    {
      id: 2,
      name: "Advocate Priya Sharma",
      specialization: "Family Law",
      rating: 4.9,
      experience: "12 years",
    },
    {
      id: 3,
      name: "Advocate Dev Patel",
      specialization: "Corporate Law",
      rating: 4.7,
      experience: "20 years",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👥 Lawyer Directory</Text>
        <Text style={styles.subtitle}>Find expert legal professionals</Text>
      </View>

      <View style={styles.directoryContainer}>
        {lawyers.map((lawyer) => (
          <View key={lawyer.id} style={styles.lawyerCard}>
            <View style={styles.lawyerHeader}>
              <Text style={styles.lawyerName}>{lawyer.name}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>⭐ {lawyer.rating}</Text>
              </View>
            </View>
            <Text style={styles.specialization}>{lawyer.specialization}</Text>
            <Text style={styles.experience}>
              Experience: {lawyer.experience}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#1e40af",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#dbeafe",
  },
  directoryContainer: {
    padding: 20,
  },
  lawyerCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lawyerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  lawyerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    flex: 1,
  },
  ratingContainer: {
    backgroundColor: "#f0f9ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rating: {
    fontSize: 12,
    color: "#1e40af",
    fontWeight: "500",
  },
  specialization: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "500",
    marginBottom: 4,
  },
  experience: {
    fontSize: 14,
    color: "#6b7280",
  },
});
