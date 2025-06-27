import React from "react";
import { View, Text, ScrollView } from "react-native";
import { styles } from "@/constants/AppStyles";

const SAMPLE_LAWYERS = [
  {
    id: 1,
    name: "Advocate Meera Sharma",
    specialization: ["Criminal Law", "Family Law"],
    location: "Delhi",
    experience: 15,
    rating: 4.8,
    reviewCount: 124,
    isVerified: true,
    barCouncilId: "DL/12345",
  },
  {
    id: 2,
    name: "Senior Advocate R.K. Singh",
    specialization: ["Constitutional Law", "Civil Rights"],
    location: "Mumbai",
    experience: 25,
    rating: 4.9,
    reviewCount: 89,
    isVerified: true,
    barCouncilId: "MH/67890",
  },
  {
    id: 3,
    name: "Advocate Priya Patel",
    specialization: ["Corporate Law", "Tax Law"],
    location: "Bangalore",
    experience: 8,
    rating: 4.6,
    reviewCount: 67,
    isVerified: true,
    barCouncilId: "KA/54321",
  },
];

export default function DirectoryScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>Lawyer Directory</Text>
        <Text style={styles.subtitle}>
          Find experienced legal professionals
        </Text>

        {SAMPLE_LAWYERS.map((lawyer) => (
          <View key={lawyer.id} style={styles.card}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 8,
              }}
            >
              <Text
                style={[
                  styles.text,
                  { fontWeight: "600", fontSize: 16, flex: 1 },
                ]}
              >
                {lawyer.name}
              </Text>
              {lawyer.isVerified && (
                <View
                  style={{
                    backgroundColor: "#10b981",
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 10,
                      fontWeight: "600",
                    }}
                  >
                    VERIFIED
                  </Text>
                </View>
              )}
            </View>

            <Text
              style={[
                styles.text,
                { fontSize: 14, color: "#64748b", marginBottom: 4 },
              ]}
            >
              {lawyer.specialization.join(" • ")}
            </Text>

            <Text
              style={[
                styles.text,
                { fontSize: 14, color: "#64748b", marginBottom: 4 },
              ]}
            >
              📍 {lawyer.location} • {lawyer.experience} years experience
            </Text>

            <Text
              style={[
                styles.text,
                { fontSize: 14, color: "#64748b", marginBottom: 8 },
              ]}
            >
              Bar Council ID: {lawyer.barCouncilId}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={[
                  styles.text,
                  { fontSize: 14, fontWeight: "600", color: "#f59e0b" },
                ]}
              >
                ⭐ {lawyer.rating}
              </Text>
              <Text
                style={[
                  styles.text,
                  { fontSize: 12, color: "#64748b", marginLeft: 8 },
                ]}
              >
                ({lawyer.reviewCount} reviews)
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
