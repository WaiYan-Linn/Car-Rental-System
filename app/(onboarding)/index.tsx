import { router } from "expo-router";
import React from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function OnboardingOne() {
  return (
    <View className="flex-1 bg-[#0a2a32]">
      {/* 1. The Asset Image as the Main Background/Frame */}
      <Image
        source={require("@/assets/images/screen1.png")}
        style={{ width: width, height: height }}
        className="absolute top-0 left-0"
        resizeMode="cover"
      />

      {/* 2. Content Overlay */}
      <SafeAreaView className="flex-1">
        {/* Header Navigation */}
        <View className="flex-row justify-between px-8 mt-4">
          <TouchableOpacity onPress={() => router.replace("/auth/login")}>
            <Text className="text-lg font-medium text-white opacity-80">
              Skip
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(onboarding)/screen2")}
          >
            <Text className="text-[#16a8e3] text-lg font-semibold">Next</Text>
          </TouchableOpacity>
        </View>

        {/* Text Positioning: Matched to Figma layout */}
        <View className="px-10 mt-20">
          <Text className="text-[#16a8e3] text-[34px] font-bold leading-tight">
            Find the Perfect Car
          </Text>
          <Text className="text-[#16a8e3] text-xl font-medium mt-4 ml-auto w-[70%] text-right">
            Browse cars available near you.
          </Text>
        </View>

        {/* 3. Custom Pagination Dots (Figma Style) */}
        <View className="absolute flex-row items-center self-center bottom-16">
          {/* Active Dot */}
          <View className="h-[6px] w-10 rounded-full bg-[#16a8e3] mx-1" />
          {/* Inactive Dots */}
          <View className="h-[6px] w-8 rounded-full border border-[#16a8e3] opacity-50 mx-1" />
          <View className="h-[6px] w-8 rounded-full border border-[#16a8e3] opacity-50 mx-1" />
        </View>
      </SafeAreaView>
    </View>
  );
}
