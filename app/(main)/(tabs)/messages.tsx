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
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { SearchBar } from "@/components/ui/SearchBar";
import { Card } from "@/components/ui/Card";
import {
  LegalTheme,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

interface ChatItem {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
  avatar?: string;
  isGroup?: boolean;
}

export default function MessagesScreen() {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [filteredChats, setFilteredChats] = useState<ChatItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    filterChats();
  }, [searchQuery, chats]);

  const loadChats = async () => {
    // Mock data for demonstration
    const mockChats: ChatItem[] = [
      {
        id: "1",
        name: "Adv. Rajesh Kumar",
        role: "Senior Lawyer",
        lastMessage: "The court hearing is scheduled for next Monday.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        unreadCount: 2,
        isOnline: true,
      },
      {
        id: "2",
        name: "Criminal Law Support Group",
        role: "Group Chat",
        lastMessage: "New BNS amendment discussion",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        unreadCount: 5,
        isOnline: false,
        isGroup: true,
      },
      {
        id: "3",
        name: "Adv. Priya Sharma",
        role: "Junior Lawyer",
        lastMessage: "Thanks for the case documents.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        unreadCount: 0,
        isOnline: false,
      },
      {
        id: "4",
        name: "Legal Assistant Team",
        role: "Group Chat",
        lastMessage: "Court schedule updated for tomorrow",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        unreadCount: 1,
        isOnline: false,
        isGroup: true,
      },
      {
        id: "5",
        name: "Adv. Suresh Patel",
        role: "Lawyer",
        lastMessage: "The bail application was approved.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        unreadCount: 0,
        isOnline: true,
      },
    ];

    setChats(mockChats);
  };

  const filterChats = () => {
    let filtered = chats;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (chat) =>
          chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredChats(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadChats();
    setRefreshing(false);
  };

  const handleChatPress = (chat: ChatItem) => {
    router.push(`/(main)/chat/${chat.id}`);
  };

  const handleNewChat = () => {
    Alert.alert(
      "New Chat",
      "Feature to start new conversations will be available soon!",
    );
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else if (days < 7) {
      return `${days}d`;
    } else {
      return timestamp.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
    }
  };

  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity onPress={() => handleChatPress(item)}>
      <Card style={styles.chatCard} padding="medium">
        <View style={styles.chatContent}>
          <View style={styles.avatarContainer}>
            <View
              style={[styles.avatar, { backgroundColor: theme.primary + "20" }]}
            >
              <Ionicons
                name={item.isGroup ? "people" : "person"}
                size={24}
                color={theme.primary}
              />
            </View>
            {item.isOnline && !item.isGroup && (
              <View
                style={[
                  styles.onlineIndicator,
                  { backgroundColor: theme.success },
                ]}
              />
            )}
          </View>

          <View style={styles.chatInfo}>
            <View style={styles.chatHeader}>
              <Text
                style={[styles.chatName, { color: theme.text }]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text style={[styles.timestamp, { color: theme.textTertiary }]}>
                {formatTimestamp(item.timestamp)}
              </Text>
            </View>

            <View style={styles.chatFooter}>
              <Text
                style={[styles.lastMessage, { color: theme.textSecondary }]}
                numberOfLines={1}
              >
                {item.lastMessage}
              </Text>
              {item.unreadCount > 0 && (
                <View
                  style={[
                    styles.unreadBadge,
                    { backgroundColor: theme.primary },
                  ]}
                >
                  <Text
                    style={[styles.unreadText, { color: theme.textInverse }]}
                  >
                    {item.unreadCount > 99 ? "99+" : item.unreadCount}
                  </Text>
                </View>
              )}
            </View>

            <Text style={[styles.role, { color: theme.textTertiary }]}>
              {item.role}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, { color: theme.text }]}>Messages</Text>
          <TouchableOpacity
            onPress={handleNewChat}
            style={styles.newChatButton}
          >
            <Ionicons name="add-circle" size={28} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search conversations..."
          style={styles.searchBar}
          showVoice={false}
          showFilter={false}
        />
      </View>

      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="chatbubbles-outline"
              size={64}
              color={theme.textTertiary}
            />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No conversations yet
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textTertiary }]}>
              Start a conversation with verified lawyers
            </Text>
          </View>
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  newChatButton: {
    padding: Spacing.xs,
  },
  searchBar: {
    marginBottom: Spacing.sm,
  },
  chatsList: {
    padding: Spacing.lg,
  },
  chatCard: {
    marginBottom: Spacing.sm,
  },
  chatContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: Spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "white",
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  chatName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    flex: 1,
  },
  timestamp: {
    fontSize: FontSizes.xs,
    marginLeft: Spacing.sm,
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  lastMessage: {
    fontSize: FontSizes.sm,
    flex: 1,
    lineHeight: 18,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  unreadText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
  },
  role: {
    fontSize: FontSizes.xs,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: Spacing.xxxl,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: FontSizes.sm,
    textAlign: "center",
  },
});
