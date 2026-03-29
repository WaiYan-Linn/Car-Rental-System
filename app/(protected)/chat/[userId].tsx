import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Send } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
// Use the high-performance avoiding view
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatScreen() {
  const { userId: partnerId } = useLocalSearchParams<{ userId: string }>();
  const { user } = useAuthStore();
  const {
    messages,
    fetchMessages,
    sendMessage,
    markAsRead,
    subscribeToMessages,
  } = useChatStore();

  const [text, setText] = useState("");
  const [partner, setPartner] = useState<{
    full_name: string;
    avatar_url: string | null;
  } | null>(null);

  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!partnerId) return;
    const fetchPartner = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", partnerId)
        .single();
      if (data) setPartner(data);
    };
    fetchPartner();
  }, [partnerId]);

  useEffect(() => {
    if (!user?.id || !partnerId) return;
    fetchMessages(user.id, partnerId);
    markAsRead(user.id, partnerId);
    const unsubscribe = subscribeToMessages(user.id);
    return () => unsubscribe();
  }, [user?.id, partnerId]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || !user?.id || !partnerId) return;
    setText("");
    await sendMessage(user.id, partnerId, trimmed);
  };

  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  const renderMessage = ({ item }: { item: any }) => {
    const isMine = item.sender_id === user?.id;
    return (
      <View
        className={`flex-row ${isMine ? "justify-end" : "justify-start"} px-4 my-2`}
      >
        <View className={`max-w-[80%] ${isMine ? "items-end" : "items-start"}`}>
          <View
            className={`px-4 py-3 shadow-sm ${isMine ? "bg-[#38bdf8] rounded-3xl rounded-tr-none" : "bg-white border border-slate-100 rounded-3xl rounded-tl-none"}`}
          >
            <Text
              className={`text-[15px] leading-5 ${isMine ? "text-white" : "text-slate-700"}`}
            >
              {item.content}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* 1. HEADER - Static at the top */}
      <View
        style={{ paddingTop: insets.top }}
        className="z-10 flex-row items-center justify-between px-4 py-3 bg-white border-b border-slate-100"
      >
        <Pressable
          onPress={() => router.back()}
          className="p-2 -ml-2 rounded-full bg-slate-50"
        >
          <ChevronLeft size={24} color="#0ea5e9" />
        </Pressable>
        <Text className="text-lg font-bold text-[#0ea5e9] flex-1 text-center">
          {partner?.full_name || "Chat"}
        </Text>
        <View className="w-10 h-10 overflow-hidden rounded-full bg-slate-200">
          {partner?.avatar_url && (
            <Image
              source={{ uri: partner.avatar_url }}
              className="w-full h-full"
            />
          )}
        </View>
      </View>

      {/* 2. THE ENGINE - Same props as your example */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={"translate-with-padding"}
        keyboardVerticalOffset={0}
      >
        <View className="flex-1">
          <FlatList
            inverted
            data={reversedMessages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* 3. INPUT BAR - Stay at the bottom of the AvoidingView */}
        <View className="flex-row items-center px-4 py-3 border-t border-slate-100">
          <View className="flex-row items-center flex-1 px-5 py-2 border bg-slate-50 rounded-3xl border-slate-100">
            <TextInput
              className="flex-1 text-[15px] text-slate-900 max-h-24 py-1"
              placeholder="Message..."
              placeholderTextColor="#94a3b8"
              value={text}
              onChangeText={setText}
              multiline
            />
          </View>
          <Pressable
            onPress={handleSend}
            disabled={!text.trim()}
            className="ml-3"
          >
            <Send size={24} color={text.trim() ? "#0ea5e9" : "#cbd5e1"} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
