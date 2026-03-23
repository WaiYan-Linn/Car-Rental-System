import { router } from "expo-router";
import React from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function OnboardingTwo() {
  return (
    <View className="flex-1 bg-[#e0f4ff]">
      {/* 1. The Asset Image (Two Cars) */}
      {/* We position it at the bottom to allow the text to breathe at the top */}
      <Image
        source={require("@/assets/images/screen2.png")}
        style={{ width: width, height: height }}
        className="absolute top-0 left-0"
        resizeMode="cover"
      />

      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between px-8 mt-4">
          <TouchableOpacity onPress={() => router.replace("/auth/login")}>
            <Text className="text-[#0a2a32] text-lg font-medium opacity-60">
              Skip
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(onboarding)/screen3")}
          >
            <Text className="text-[#16a8e3] text-lg font-semibold">Next</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Text Content (Asymmetric Layout) */}
        <View className="px-8 mt-12">
          {/* Top Left Text */}
          <View>
            <Text className="text-[#0a2a32] text-[34px] font-bold leading-tight">
              Easy Booking
            </Text>
            <Text className="text-[#16a8e3] text-lg font-medium mt-1">
              Reserve your car in seconds.
            </Text>
          </View>

          {/* Bottom Right Text (Offset) */}
          <View className="items-end mt-20">
            <Text className="text-[#0a2a32] text-[34px] font-bold leading-tight text-right">
              Real-Time Chat
            </Text>
            <Text className="text-[#16a8e3] text-lg font-medium mt-1 text-right">
              Chat instantly with car owners.
            </Text>
          </View>
        </View>

        {/* 3. Pagination Dots (Middle active) */}
        <View className="absolute flex-row items-center self-center bottom-16">
          <View className="h-[6px] w-8 rounded-full border border-[#16a8e3] opacity-50 mx-1" />
          <View className="h-[6px] w-10 rounded-full bg-[#16a8e3] mx-1" />
          <View className="h-[6px] w-8 rounded-full border border-[#16a8e3] opacity-50 mx-1" />
        </View>
      </SafeAreaView>
    </View>
  );
}
