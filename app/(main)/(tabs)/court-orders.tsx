import React from "react";
import { View, Text, ScrollView } from "react-native";
import { styles } from "@/constants/AppStyles";

const SAMPLE_ORDERS = [
  {
    id: 1,
    title: "Bail Application Order",
    court: "Delhi High Court",
    judge: "Justice A.K. Sharma",
    date: "2024-01-15",
    type: "order",
    summary: "Bail granted to the accused with conditions",
    importance: "high",
  },
  {
    id: 2,
    title: "Matrimonial Dispute Judgment",
    court: "Family Court, Mumbai",
    judge: "Justice P.R. Desai",
    date: "2024-01-14",
    type: "judgment",
    summary: "Divorce decree granted with alimony provisions",
    importance: "medium",
  },
  {
    id: 3,
    title: "Property Dispute Notice",
    court: "Civil Court, Bangalore",
    judge: "Justice S.K. Reddy",
    date: "2024-01-13",
    type: "notice",
    summary: "Notice issued for property ownership clarification",
    importance: "low",
  },
];

export default function CourtOrdersScreen() {
  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#64748b";
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>Court Orders</Text>
        <Text style={styles.subtitle}>Latest court orders and judgments</Text>

        {SAMPLE_ORDERS.map((order) => (
          <View key={order.id} style={styles.card}>
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
                {order.title}
              </Text>
              <View
                style={{
                  backgroundColor: getImportanceColor(order.importance),
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{ color: "#ffffff", fontSize: 12, fontWeight: "600" }}
                >
                  {order.importance.toUpperCase()}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.text,
                { fontSize: 14, color: "#64748b", marginBottom: 4 },
              ]}
            >
              {order.court} • {order.judge}
            </Text>

            <Text
              style={[
                styles.text,
                { fontSize: 14, color: "#64748b", marginBottom: 8 },
              ]}
            >
              {new Date(order.date).toLocaleDateString("en-IN")} •{" "}
              {order.type.toUpperCase()}
            </Text>

            <Text style={[styles.text, { fontSize: 14 }]}>{order.summary}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
