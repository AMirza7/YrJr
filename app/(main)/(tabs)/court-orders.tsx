import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function CourtOrdersScreen() {
  const orders = [
    {
      id: 1,
      title: "Property Dispute Case",
      status: "Active",
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Contract Violation",
      status: "Pending",
      date: "2024-01-10",
    },
    {
      id: 3,
      title: "Family Court Matter",
      status: "Completed",
      date: "2024-01-05",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 Court Orders</Text>
        <Text style={styles.subtitle}>Track your legal proceedings</Text>
      </View>

      <View style={styles.ordersContainer}>
        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <Text style={styles.orderTitle}>{order.title}</Text>
            <View style={styles.orderDetails}>
              <Text style={styles.orderDate}>Date: {order.date}</Text>
              <Text
                style={[
                  styles.orderStatus,
                  { color: getStatusColor(order.status) },
                ]}
              >
                {order.status}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "Active":
      return "#10b981";
    case "Pending":
      return "#f59e0b";
    case "Completed":
      return "#6b7280";
    default:
      return "#374151";
  }
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
  ordersContainer: {
    padding: 20,
  },
  orderCard: {
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
  orderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  orderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderDate: {
    fontSize: 14,
    color: "#6b7280",
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: "500",
  },
});
