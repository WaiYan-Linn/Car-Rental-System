import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { useFocusEffect, useRouter } from "expo-router";
import { MessageSquareOff } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

export default function MessagesScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    conversations,
    isLoadingConversations,
    fetchConversations,
    subscribeToMessages,
  } = useChatStore();

  // 1. Force a re-render every 30 seconds to update timestamps ("2m ago")
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 30000); // 30 seconds
    return () => clearInterval(timer);
  }, []);

  // 2. Refresh list and start Realtime subscription whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;

      // Initial fetch to clear unread counts or update list order
      fetchConversations(user.id);

      // Start listening for new messages while on this screen
      const unsubscribe = subscribeToMessages(user.id);

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }, [user?.id]),
  );

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    if (user?.id) fetchConversations(user.id);
  }, [user?.id]);

  // Format relative time (re-calculates every 'tick')
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString();
  };

  const renderItem = ({ item }: { item: (typeof conversations)[0] }) => (
    <Pressable
      className="flex-row items-center px-4 py-3 border-b border-gray-100 active:bg-slate-50"
      onPress={() => router.push(`/(protected)/chat/${item.partner_id}`)}
    >
      {/* Avatar */}
      <Image
        source={{
          uri: item.partner_avatar || "https://via.placeholder.com/48",
        }}
        className="w-12 h-12 bg-gray-200 rounded-full"
      />

      {/* Name + Last message */}
      <View className="flex-1 ml-3">
        <View className="flex-row items-center justify-between">
          <Text
            className="text-base font-semibold text-gray-900"
            numberOfLines={1}
          >
            {item.partner_name}
          </Text>
          <Text className="text-xs text-gray-400">
            {formatTime(item.last_message_at)}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mt-1">
          <Text className="flex-1 mr-2 text-sm text-gray-500" numberOfLines={1}>
            {item.last_message}
          </Text>
          {item.unread_count > 0 && (
            <View className="bg-blue-500 rounded-full min-w-[20px] h-5 justify-center items-center px-1.5">
              <Text className="text-xs font-bold text-white">
                {item.unread_count}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );

  if (isLoadingConversations && conversations.length === 0) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#16a8e3" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.partner_id}
        renderItem={renderItem}
        onRefresh={onRefresh}
        refreshing={isLoadingConversations}
        ListEmptyComponent={
          <View className="items-center justify-center flex-1 mt-20">
            <MessageSquareOff size={48} color="#d1d5db" />
            <Text className="mt-4 text-base text-gray-400">
              No messages yet
            </Text>
          </View>
        }
      />
    </View>
  );
}
