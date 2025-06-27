import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { styles } from "@/constants/AppStyles";

interface ClientFolder {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  totalCases: number;
  activeStatus: "active" | "inactive" | "completed";
  totalValue: number;
  lastActivity: Date;
  color: string;
  notes: string;
}

const SAMPLE_FOLDERS: ClientFolder[] = [
  {
    id: "1",
    clientName: "Rajesh Patel",
    clientEmail: "rajesh.patel@email.com",
    clientPhone: "+91 9876543210",
    totalCases: 3,
    activeStatus: "active",
    totalValue: 150000,
    lastActivity: new Date("2024-01-20"),
    color: "#dbeafe",
    notes: "Property dispute case ongoing. Client very cooperative.",
  },
  {
    id: "2",
    clientName: "Priya Sharma",
    clientEmail: "priya.sharma@email.com",
    clientPhone: "+91 9876543211",
    totalCases: 1,
    activeStatus: "completed",
    totalValue: 75000,
    lastActivity: new Date("2024-01-15"),
    color: "#d1fae5",
    notes: "Divorce case completed successfully. Final settlement done.",
  },
  {
    id: "3",
    clientName: "Tech Solutions Pvt Ltd",
    clientEmail: "legal@techsolutions.com",
    clientPhone: "+91 9876543212",
    totalCases: 5,
    activeStatus: "active",
    totalValue: 500000,
    lastActivity: new Date("2024-01-22"),
    color: "#fef3c7",
    notes: "Corporate legal matters. Regular compliance work.",
  },
];

export default function ClientFoldersScreen() {
  const [folders, setFolders] = useState<ClientFolder[]>(SAMPLE_FOLDERS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<ClientFolder | null>(
    null,
  );
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#10b981";
      case "inactive":
        return "#f59e0b";
      case "completed":
        return "#64748b";
      default:
        return "#64748b";
    }
  };

  const handleAddClient = () => {
    if (
      !newClient.name.trim() ||
      !newClient.email.trim() ||
      !newClient.phone.trim()
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const folder: ClientFolder = {
      id: Date.now().toString(),
      clientName: newClient.name,
      clientEmail: newClient.email,
      clientPhone: newClient.phone,
      totalCases: 0,
      activeStatus: "active",
      totalValue: 0,
      lastActivity: new Date(),
      color: "#f3f4f6",
      notes: newClient.notes,
    };

    setFolders([folder, ...folders]);
    setNewClient({ name: "", email: "", phone: "", notes: "" });
    setShowAddForm(false);
    Alert.alert("Success", "Client folder created successfully");
  };

  if (selectedFolder) {
    return (
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View>
              <Text style={styles.title}>📁 Client Details</Text>
              <Text style={styles.subtitle}>{selectedFolder.clientName}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: "#64748b",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                },
              ]}
              onPress={() => setSelectedFolder(null)}
            >
              <Text style={[styles.buttonText, { fontSize: 14 }]}>
                Back to Folders
              </Text>
            </TouchableOpacity>
          </View>

          {/* Client Info */}
          <View
            style={[styles.card, { backgroundColor: selectedFolder.color }]}
          >
            <Text
              style={[
                styles.text,
                { fontWeight: "600", fontSize: 18, marginBottom: 12 },
              ]}
            >
              {selectedFolder.clientName}
            </Text>

            <View style={{ marginBottom: 8 }}>
              <Text style={[styles.text, { fontSize: 14, color: "#64748b" }]}>
                📧 Email
              </Text>
              <Text style={[styles.text, { fontSize: 16 }]}>
                {selectedFolder.clientEmail}
              </Text>
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text style={[styles.text, { fontSize: 14, color: "#64748b" }]}>
                📱 Phone
              </Text>
              <Text style={[styles.text, { fontSize: 16 }]}>
                {selectedFolder.clientPhone}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <View>
                <Text style={[styles.text, { fontSize: 14, color: "#64748b" }]}>
                  Total Cases
                </Text>
                <Text
                  style={[styles.text, { fontSize: 18, fontWeight: "600" }]}
                >
                  {selectedFolder.totalCases}
                </Text>
              </View>
              <View>
                <Text style={[styles.text, { fontSize: 14, color: "#64748b" }]}>
                  Total Value
                </Text>
                <Text
                  style={[styles.text, { fontSize: 18, fontWeight: "600" }]}
                >
                  ₹{selectedFolder.totalValue.toLocaleString("en-IN")}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: getStatusColor(selectedFolder.activeStatus),
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{ color: "#ffffff", fontSize: 12, fontWeight: "600" }}
                >
                  {selectedFolder.activeStatus.toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.text, { fontSize: 12, color: "#64748b" }]}>
                Last activity:{" "}
                {selectedFolder.lastActivity.toLocaleDateString("en-IN")}
              </Text>
            </View>
          </View>

          {/* Notes */}
          <View style={styles.card}>
            <Text style={[styles.text, { fontWeight: "600", marginBottom: 8 }]}>
              Notes
            </Text>
            <Text style={[styles.text, { fontSize: 14 }]}>
              {selectedFolder.notes || "No notes added yet."}
            </Text>
          </View>

          {/* Recent Cases */}
          <View style={styles.card}>
            <Text
              style={[styles.text, { fontWeight: "600", marginBottom: 12 }]}
            >
              Recent Cases
            </Text>
            {selectedFolder.totalCases > 0 ? (
              <View>
                <Text style={[styles.text, { fontSize: 14, color: "#64748b" }]}>
                  Sample case entries would appear here based on client's active
                  cases.
                </Text>
              </View>
            ) : (
              <Text style={[styles.text, { fontSize: 14, color: "#64748b" }]}>
                No cases assigned yet.
              </Text>
            )}
          </View>

          {/* Actions */}
          <View style={styles.card}>
            <Text
              style={[styles.text, { fontWeight: "600", marginBottom: 12 }]}
            >
              Quick Actions
            </Text>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: "#1e40af", marginBottom: 8 },
              ]}
              onPress={() =>
                Alert.alert("Coming Soon", "Add new case functionality")
              }
            >
              <Text style={styles.buttonText}>+ Add New Case</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: "#10b981", marginBottom: 8 },
              ]}
              onPress={() =>
                Alert.alert("Coming Soon", "Schedule meeting functionality")
              }
            >
              <Text style={styles.buttonText}>📅 Schedule Meeting</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#f59e0b" }]}
              onPress={() =>
                Alert.alert("Coming Soon", "Generate invoice functionality")
              }
            >
              <Text style={styles.buttonText}>💰 Generate Invoice</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <View>
            <Text style={styles.title}>📁 Client Folders</Text>
            <Text style={styles.subtitle}>
              Organize client information and cases
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: "#64748b",
                paddingHorizontal: 12,
                paddingVertical: 8,
              },
            ]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, { fontSize: 14 }]}>Close</Text>
          </TouchableOpacity>
        </View>

        {/* Add Client Form */}
        {showAddForm && (
          <View
            style={[
              styles.card,
              { marginBottom: 20, backgroundColor: "#f8fafc" },
            ]}
          >
            <Text
              style={[styles.text, { fontWeight: "600", marginBottom: 12 }]}
            >
              Add New Client
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Client name *"
              value={newClient.name}
              onChangeText={(text) =>
                setNewClient({ ...newClient, name: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Email address *"
              value={newClient.email}
              onChangeText={(text) =>
                setNewClient({ ...newClient, email: text })
              }
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Phone number *"
              value={newClient.phone}
              onChangeText={(text) =>
                setNewClient({ ...newClient, phone: text })
              }
              keyboardType="phone-pad"
            />

            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              placeholder="Notes (optional)"
              value={newClient.notes}
              onChangeText={(text) =>
                setNewClient({ ...newClient, notes: text })
              }
              multiline
            />

            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                style={[styles.button, { flex: 1, backgroundColor: "#10b981" }]}
                onPress={handleAddClient}
              >
                <Text style={styles.buttonText}>Create Folder</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { flex: 1, backgroundColor: "#64748b" }]}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Add Client Button */}
        {!showAddForm && (
          <TouchableOpacity
            style={[styles.button, { marginBottom: 20 }]}
            onPress={() => setShowAddForm(true)}
          >
            <Text style={styles.buttonText}>+ Add New Client</Text>
          </TouchableOpacity>
        )}

        {/* Client Folders List */}
        <Text
          style={[
            styles.text,
            { fontSize: 18, fontWeight: "600", marginBottom: 16 },
          ]}
        >
          Client Folders ({folders.length})
        </Text>

        {folders.map((folder) => (
          <TouchableOpacity
            key={folder.id}
            style={[styles.card, { backgroundColor: folder.color }]}
            onPress={() => setSelectedFolder(folder)}
          >
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
                📁 {folder.clientName}
              </Text>
              <View
                style={{
                  backgroundColor: getStatusColor(folder.activeStatus),
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{ color: "#ffffff", fontSize: 10, fontWeight: "600" }}
                >
                  {folder.activeStatus.toUpperCase()}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.text,
                { fontSize: 14, color: "#64748b", marginBottom: 4 },
              ]}
            >
              📧 {folder.clientEmail}
            </Text>

            <Text
              style={[
                styles.text,
                { fontSize: 14, color: "#64748b", marginBottom: 8 },
              ]}
            >
              📱 {folder.clientPhone}
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={[styles.text, { fontSize: 14, fontWeight: "600" }]}>
                {folder.totalCases} cases • ₹
                {folder.totalValue.toLocaleString("en-IN")}
              </Text>
              <Text style={[styles.text, { fontSize: 12, color: "#64748b" }]}>
                {folder.lastActivity.toLocaleDateString("en-IN")}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {folders.length === 0 && (
          <View style={styles.card}>
            <Text
              style={[styles.text, { textAlign: "center", color: "#64748b" }]}
            >
              No client folders yet. Add your first client above!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
