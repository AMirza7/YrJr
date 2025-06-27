import React from "react";
import { View, Text, ScrollView } from "react-native";
import { styles } from "@/constants/AppStyles";

const SAMPLE_MESSAGES = [
  {
    id: 1,
    senderName: "Advocate Kumar",
    lastMessage: "The hearing is scheduled for next Tuesday",
    timestamp: "2 hours ago",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: 2,
    senderName: "Client - Rajesh Patel",
    lastMessage: "Thank you for the legal advice",
    timestamp: "1 day ago",
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 3,
    senderName: "Court Registry",
    lastMessage: "Case documents submitted successfully",
    timestamp: "2 days ago",
    unreadCount: 1,
    isOnline: false,
  },
];

export default function MessagesScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>Recent conversations</Text>

        {SAMPLE_MESSAGES.map((message) => (
          <View key={message.id} style={styles.card}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 8,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <Text
                  style={[styles.text, { fontWeight: "600", fontSize: 16 }]}
                >
                  {message.senderName}
                </Text>
                {message.isOnline && (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#10b981",
                      marginLeft: 8,
                    }}
                  />
                )}
              </View>

              {message.unreadCount > 0 && (
                <View
                  style={{
                    backgroundColor: "#ef4444",
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 10,
                    minWidth: 20,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    {message.unreadCount}
                  </Text>
                </View>
              )}
            </View>

            <Text
              style={[
                styles.text,
                { fontSize: 14, color: "#374151", marginBottom: 4 },
              ]}
            >
              {message.lastMessage}
            </Text>

            <Text style={[styles.text, { fontSize: 12, color: "#64748b" }]}>
              {message.timestamp}
            </Text>
          </View>
        ))}

        {SAMPLE_MESSAGES.length === 0 && (
          <View style={styles.card}>
            <Text
              style={[styles.text, { textAlign: "center", color: "#64748b" }]}
            >
              No messages yet
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
