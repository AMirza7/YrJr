import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  TextInput,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface ReferralData {
  id: string;
  referrerId: string;
  referrerName: string;
  refereeId: string;
  refereeName: string;
  date: string;
  rewarded: boolean;
  amount: number;
  status: "pending" | "completed" | "failed";
}

export default function ReferralManager() {
  const { theme } = useTheme();
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [filteredReferrals, setFilteredReferrals] = useState<ReferralData[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  // Filters
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [rewardedFilter, setRewardedFilter] = useState<
    "all" | "rewarded" | "pending"
  >("all");

  useEffect(() => {
    loadReferrals();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [referrals, dateFrom, dateTo, rewardedFilter]);

  const loadReferrals = async () => {
    try {
      // Mock API call - replace with actual API
      const mockReferrals: ReferralData[] = [
        {
          id: "ref_001",
          referrerId: "user_123",
          referrerName: "Adv. Rajesh Kumar",
          refereeId: "user_456",
          refereeName: "Priya Sharma",
          date: "2024-01-15T10:30:00Z",
          rewarded: true,
          amount: 50,
          status: "completed",
        },
        {
          id: "ref_002",
          referrerId: "user_789",
          referrerName: "Amit Singh",
          refereeId: "user_012",
          refereeName: "Sunita Patel",
          date: "2024-01-14T15:20:00Z",
          rewarded: false,
          amount: 50,
          status: "pending",
        },
        {
          id: "ref_003",
          referrerId: "user_345",
          referrerName: "Deepak Verma",
          refereeId: "user_678",
          refereeName: "Kavita Mehta",
          date: "2024-01-13T09:45:00Z",
          rewarded: true,
          amount: 50,
          status: "completed",
        },
        {
          id: "ref_004",
          referrerId: "user_901",
          referrerName: "Rohit Sharma",
          refereeId: "user_234",
          refereeName: "Neha Gupta",
          date: "2024-01-12T14:10:00Z",
          rewarded: false,
          amount: 50,
          status: "pending",
        },
      ];
      setReferrals(mockReferrals);
    } catch (error) {
      console.error("Error loading referrals:", error);
      Alert.alert("Error", "Failed to load referral data");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...referrals];

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(
        (ref) => new Date(ref.date) >= new Date(dateFrom),
      );
    }
    if (dateTo) {
      filtered = filtered.filter(
        (ref) => new Date(ref.date) <= new Date(dateTo),
      );
    }

    // Rewarded status filter
    if (rewardedFilter === "rewarded") {
      filtered = filtered.filter((ref) => ref.rewarded);
    } else if (rewardedFilter === "pending") {
      filtered = filtered.filter((ref) => !ref.rewarded);
    }

    setFilteredReferrals(filtered);
  };

  const toggleRewarded = async (referralId: string) => {
    try {
      const referralIndex = referrals.findIndex((ref) => ref.id === referralId);
      if (referralIndex === -1) return;

      const referral = referrals[referralIndex];
      const newRewardedStatus = !referral.rewarded;

      Alert.alert(
        newRewardedStatus ? "Mark as Rewarded" : "Mark as Pending",
        `Are you sure you want to ${newRewardedStatus ? "mark this referral as rewarded" : "mark this referral as pending"}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            onPress: async () => {
              // Mock API call - replace with actual API
              const updatedReferrals = [...referrals];
              updatedReferrals[referralIndex] = {
                ...referral,
                rewarded: newRewardedStatus,
                status: newRewardedStatus ? "completed" : "pending",
              };
              setReferrals(updatedReferrals);

              Alert.alert(
                "Success",
                `Referral ${newRewardedStatus ? "marked as rewarded" : "marked as pending"} successfully`,
              );
            },
          },
        ],
      );
    } catch (error) {
      console.error("Error updating referral:", error);
      Alert.alert("Error", "Failed to update referral status");
    }
  };

  const getStatusColor = (status: ReferralData["status"]) => {
    switch (status) {
      case "completed":
        return theme.colors.success;
      case "pending":
        return theme.colors.warning;
      case "failed":
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const exportData = () => {
    // Mock export functionality
    Alert.alert(
      "Export Data",
      `Exporting ${filteredReferrals.length} referral records as CSV`,
      [{ text: "OK" }],
    );
  };

  if (loading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.centered}>
          <Text
            style={[styles.loadingText, { color: theme.colors.textSecondary }]}
          >
            Loading referral data...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          🎁 Referral Manager
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Manage referral rewards and track referral performance
        </Text>
      </View>

      {/* Filters */}
      <View
        style={[
          styles.filtersSection,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <Text style={[styles.filtersTitle, { color: theme.colors.text }]}>
          Filters
        </Text>

        <View style={styles.filtersRow}>
          <View style={styles.dateFilter}>
            <Text
              style={[
                styles.filterLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              From Date
            </Text>
            <TextInput
              style={[
                styles.dateInput,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="YYYY-MM-DD"
              value={dateFrom}
              onChangeText={setDateFrom}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.dateFilter}>
            <Text
              style={[
                styles.filterLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              To Date
            </Text>
            <TextInput
              style={[
                styles.dateInput,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="YYYY-MM-DD"
              value={dateTo}
              onChangeText={setDateTo}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.statusFilter}>
          <Text
            style={[styles.filterLabel, { color: theme.colors.textSecondary }]}
          >
            Reward Status
          </Text>
          <View style={styles.statusButtons}>
            {["all", "rewarded", "pending"].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusButton,
                  rewardedFilter === status && {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
                onPress={() => setRewardedFilter(status as any)}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    {
                      color:
                        rewardedFilter === status ? "#fff" : theme.colors.text,
                    },
                  ]}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.exportButton,
            { backgroundColor: theme.colors.success },
          ]}
          onPress={exportData}
        >
          <Text style={styles.exportButtonText}>📤 Export CSV</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Stats */}
      <View
        style={[styles.statsSection, { backgroundColor: theme.colors.surface }]}
      >
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {filteredReferrals.length}
          </Text>
          <Text
            style={[styles.statLabel, { color: theme.colors.textSecondary }]}
          >
            Total Referrals
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.warning }]}>
            {filteredReferrals.filter((r) => !r.rewarded).length}
          </Text>
          <Text
            style={[styles.statLabel, { color: theme.colors.textSecondary }]}
          >
            Pending Rewards
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.success }]}>
            ₹
            {filteredReferrals
              .filter((r) => r.rewarded)
              .reduce((sum, r) => sum + r.amount, 0)}
          </Text>
          <Text
            style={[styles.statLabel, { color: theme.colors.textSecondary }]}
          >
            Total Paid
          </Text>
        </View>
      </View>

      {/* Referrals Table */}
      <ScrollView
        style={styles.tableContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.table, { backgroundColor: theme.colors.surface }]}>
          {/* Table Header */}
          <View
            style={[
              styles.tableHeader,
              { borderBottomColor: theme.colors.border },
            ]}
          >
            <Text
              style={[
                styles.tableHeaderCell,
                styles.nameCell,
                { color: theme.colors.text },
              ]}
            >
              Referrer → Referee
            </Text>
            <Text
              style={[
                styles.tableHeaderCell,
                styles.dateCell,
                { color: theme.colors.text },
              ]}
            >
              Date
            </Text>
            <Text
              style={[
                styles.tableHeaderCell,
                styles.amountCell,
                { color: theme.colors.text },
              ]}
            >
              Amount
            </Text>
            <Text
              style={[
                styles.tableHeaderCell,
                styles.rewardedCell,
                { color: theme.colors.text },
              ]}
            >
              Rewarded
            </Text>
          </View>

          {/* Table Rows */}
          {filteredReferrals.map((referral) => (
            <View
              key={referral.id}
              style={[
                styles.tableRow,
                { borderBottomColor: theme.colors.border },
              ]}
            >
              <View style={[styles.tableCell, styles.nameCell]}>
                <Text
                  style={[styles.referrerName, { color: theme.colors.text }]}
                >
                  {referral.referrerName}
                </Text>
                <Text style={styles.arrow}>→</Text>
                <Text
                  style={[
                    styles.refereeName,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {referral.refereeName}
                </Text>
              </View>

              <View style={[styles.tableCell, styles.dateCell]}>
                <Text
                  style={[
                    styles.dateText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {formatDate(referral.date)}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(referral.status) },
                  ]}
                >
                  <Text style={styles.statusBadgeText}>
                    {referral.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={[styles.tableCell, styles.amountCell]}>
                <Text
                  style={[styles.amountText, { color: theme.colors.success }]}
                >
                  ₹{referral.amount}
                </Text>
              </View>

              <View style={[styles.tableCell, styles.rewardedCell]}>
                <Switch
                  value={referral.rewarded}
                  onValueChange={() => toggleRewarded(referral.id)}
                  trackColor={{
                    false: theme.colors.border,
                    true: theme.colors.success,
                  }}
                  thumbColor={referral.rewarded ? "#fff" : "#f4f3f4"}
                />
              </View>
            </View>
          ))}

          {filteredReferrals.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎁</Text>
              <Text
                style={[
                  styles.emptyText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                No referrals found
              </Text>
              <Text
                style={[
                  styles.emptySubtext,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Referrals will appear here when users sign up with referral
                codes
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  filtersSection: {
    padding: 16,
    marginBottom: 16,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  filtersRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  dateFilter: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  dateInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    fontSize: 12,
  },
  statusFilter: {
    marginBottom: 12,
  },
  statusButtons: {
    flexDirection: "row",
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  exportButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  exportButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  statsSection: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    textAlign: "center",
  },
  tableContainer: {
    flex: 1,
  },
  table: {
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: "600",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  tableCell: {
    justifyContent: "center",
  },
  nameCell: {
    flex: 3,
  },
  dateCell: {
    flex: 2,
  },
  amountCell: {
    flex: 1,
    alignItems: "center",
  },
  rewardedCell: {
    flex: 1,
    alignItems: "center",
  },
  referrerName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  arrow: {
    fontSize: 12,
    color: "#9ca3af",
    marginVertical: 2,
  },
  refereeName: {
    fontSize: 12,
  },
  dateText: {
    fontSize: 12,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  statusBadgeText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "700",
  },
  amountText: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
});
