import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { SearchBar } from "@/components/ui/SearchBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Rating } from "@/components/ui/Rating";
import {
  LegalTheme,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { COURT_TYPES } from "@/constants/LegalConstants";
import { CourtOrder } from "@/types";

export default function CourtOrdersScreen() {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const [searchQuery, setSearchQuery] = useState("");
  const [courtOrders, setCourtOrders] = useState<CourtOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<CourtOrder[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  useEffect(() => {
    loadCourtOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchQuery, selectedFilter, courtOrders]);

  const loadCourtOrders = async () => {
    // Mock data for demonstration
    const mockOrders: CourtOrder[] = [
      {
        id: "1",
        title: "Landmark Judgment on Fundamental Rights",
        court: "Supreme Court",
        judge: "Justice A.K. Sharma",
        date: new Date("2024-01-15"),
        type: "judgment",
        summary:
          "Important ruling clarifying the scope of Article 21 in digital age privacy rights.",
        pdfUrl: "https://example.com/judgment1.pdf",
        tags: ["fundamental rights", "privacy", "digital rights"],
        importance: "high",
      },
      {
        id: "2",
        title: "Amendment to Criminal Procedure Guidelines",
        court: "High Court Delhi",
        judge: "Justice R.P. Gupta",
        date: new Date("2024-01-12"),
        type: "order",
        summary:
          "New guidelines for handling cybercrime cases under BNSS provisions.",
        pdfUrl: "https://example.com/order1.pdf",
        tags: ["cybercrime", "BNSS", "procedure"],
        importance: "medium",
      },
      {
        id: "3",
        title: "Family Court Custody Guidelines",
        court: "Family Court Mumbai",
        judge: "Justice S.M. Verma",
        date: new Date("2024-01-10"),
        type: "order",
        summary:
          "Updated guidelines for child custody cases considering best interests of the child.",
        pdfUrl: "https://example.com/order2.pdf",
        tags: ["family law", "custody", "children"],
        importance: "medium",
      },
      {
        id: "4",
        title: "Consumer Protection Act Interpretation",
        court: "Consumer Court Bangalore",
        judge: "Justice M.K. Singh",
        date: new Date("2024-01-08"),
        type: "judgment",
        summary:
          "Clarification on e-commerce platform liability under Consumer Protection Act.",
        pdfUrl: "https://example.com/judgment2.pdf",
        tags: ["consumer protection", "e-commerce", "liability"],
        importance: "medium",
      },
    ];

    setCourtOrders(mockOrders);
  };

  const filterOrders = () => {
    let filtered = courtOrders;

    if (selectedFilter !== "All") {
      filtered = filtered.filter((order) =>
        order.court.includes(selectedFilter),
      );
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (order) =>
          order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.court.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.judge.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    setFilteredOrders(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourtOrders();
    setRefreshing(false);
  };

  const handleDownload = (order: CourtOrder) => {
    Alert.alert("Download", `Downloading ${order.title}...`);
  };

  const handleShare = (order: CourtOrder) => {
    Alert.alert("Share", `Sharing ${order.title}...`);
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high":
        return theme.error;
      case "medium":
        return theme.warning;
      default:
        return theme.info;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "judgment":
        return "document-text";
      case "order":
        return "clipboard";
      default:
        return "document";
    }
  };

  const renderCourtOrder = ({ item }: { item: CourtOrder }) => (
    <Card style={styles.orderCard} padding="medium">
      <View style={styles.orderHeader}>
        <View style={styles.orderTypeContainer}>
          <View
            style={[styles.typeIcon, { backgroundColor: theme.primary + "20" }]}
          >
            <Ionicons
              name={getTypeIcon(item.type) as any}
              size={20}
              color={theme.primary}
            />
          </View>
          <View style={styles.orderMeta}>
            <Text
              style={[styles.orderTitle, { color: theme.text }]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text style={[styles.orderCourt, { color: theme.textSecondary }]}>
              {item.court} • {item.judge}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.importanceBadge,
            { backgroundColor: getImportanceColor(item.importance) + "20" },
          ]}
        >
          <Text
            style={[
              styles.importanceText,
              { color: getImportanceColor(item.importance) },
            ]}
          >
            {item.importance.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text
        style={[styles.orderSummary, { color: theme.textSecondary }]}
        numberOfLines={3}
      >
        {item.summary}
      </Text>

      <View style={styles.tagsContainer}>
        {item.tags.slice(0, 3).map((tag, index) => (
          <View
            key={index}
            style={[styles.tag, { backgroundColor: theme.primary + "15" }]}
          >
            <Text style={[styles.tagText, { color: theme.primary }]}>
              {tag}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={[styles.orderDate, { color: theme.textTertiary }]}>
          {item.date.toLocaleDateString("en-IN")}
        </Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => handleDownload(item)}
            style={[
              styles.actionButton,
              { backgroundColor: theme.success + "20" },
            ]}
          >
            <Ionicons name="download" size={16} color={theme.success} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleShare(item)}
            style={[
              styles.actionButton,
              { backgroundColor: theme.info + "20" },
            ]}
          >
            <Ionicons name="share" size={16} color={theme.info} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  const renderFilterChip = (filter: string) => {
    const isSelected = selectedFilter === filter;
    return (
      <TouchableOpacity
        key={filter}
        onPress={() => setSelectedFilter(filter)}
        style={[
          styles.filterChip,
          {
            backgroundColor: isSelected ? theme.primary : theme.surface,
            borderColor: isSelected ? theme.primary : theme.border,
          },
        ]}
      >
        <Text
          style={[
            styles.filterChipText,
            { color: isSelected ? theme.textInverse : theme.text },
          ]}
        >
          {filter}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Text style={[styles.title, { color: theme.text }]}>Court Orders</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search court orders, judges..."
          style={styles.searchBar}
        />
      </View>

      <View
        style={[styles.filtersContainer, { backgroundColor: theme.surface }]}
      >
        <FlatList
          data={["All", ...COURT_TYPES.slice(0, 4)]}
          renderItem={({ item }) => renderFilterChip(item)}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderCourtOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          searchQuery ? (
            <EmptyState
              type="no_search_results"
              title="No Results Found"
              subtitle="Try different search terms or filters"
              actionTitle="Clear Search"
              onActionPress={() => setSearchQuery("")}
            />
          ) : (
            <EmptyState
              type="no_court_orders"
              title="No Court Orders"
              subtitle="Stay updated with the latest court orders and judgments"
              actionTitle="Refresh"
              onActionPress={onRefresh}
            />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.md,
  },
  searchBar: {
    marginBottom: Spacing.sm,
  },
  filtersContainer: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  filtersList: {
    paddingHorizontal: Spacing.lg,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  filterChipText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  ordersList: {
    padding: Spacing.lg,
  },
  orderCard: {
    marginBottom: Spacing.md,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  orderTypeContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  orderMeta: {
    flex: 1,
  },
  orderTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  orderCourt: {
    fontSize: FontSizes.sm,
  },
  importanceBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  importanceText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
  },
  orderSummary: {
    fontSize: FontSizes.sm,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Spacing.md,
  },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  tagText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderDate: {
    fontSize: FontSizes.xs,
  },
  actionButtons: {
    flexDirection: "row",
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Spacing.sm,
  },
});
