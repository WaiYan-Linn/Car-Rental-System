import { useOnboardingStore } from "@/store/onboardingStore";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function OnboardingThree() {
  const { setSeen } = useOnboardingStore();

  const handleFinish = () => {
    setSeen();
    // Use replace so the user can't swipe back to onboarding
    router.replace("/auth/login");
  };

  return (
    <View className="flex-1 bg-[#e0f4ff]">
      {/* 1. The Asset Image (Blue Car) */}
      <Image
        source={require("@/assets/images/screen3.png")}
        style={{ width: width, height: height }}
        className="absolute top-0 left-0"
        resizeMode="cover"
      />

      <SafeAreaView className="items-center flex-1">
        {/* Text Content Matched to Figma */}
        <View className="w-full px-10 mt-16">
          <Text className="text-[#0a2a32] text-[36px] font-bold leading-tight text-center">
            Start your Journey
          </Text>
          <Text className="text-[#16a8e3] text-xl font-medium mt-4 text-center">
            Pick up your car and enjoy the ride.
          </Text>
        </View>

        {/* 2. Custom Figma "Get Started" Button */}
        <TouchableOpacity
          onPress={handleFinish}
          activeOpacity={0.8}
          className="z-10 mt-16"
        >
          {/* Main outer container (the light blue capsule) */}
          <View className="bg-[#a2dffb] rounded-full flex-row items-center pl-1 pr-6 py-1">
            {/* Inner dark blue button */}
            <View className="bg-[#16a8e3] rounded-full py-4 px-8">
              <Text className="text-xl font-bold text-white">Get Started</Text>
            </View>

            {/* The Triple Chevron Indicator */}
            <View className="flex-row ml-4">
              <ChevronRight
                color="#FFFFFF"
                size={24}
                opacity={0.4}
                strokeWidth={3}
              />
              <ChevronRight
                color="#FFFFFF"
                size={24}
                opacity={0.7}
                strokeWidth={3}
                style={{ marginLeft: -12 }}
              />
              <ChevronRight
                color="#FFFFFF"
                size={24}
                opacity={1.0}
                strokeWidth={3}
                style={{ marginLeft: -12 }}
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* 3. Pagination Dots (Right active) */}
        <View className="absolute flex-row items-center self-center bottom-16">
          <View className="h-[6px] w-8 rounded-full border border-[#16a8e3] opacity-50 mx-1" />
          <View className="h-[6px] w-8 rounded-full border border-[#16a8e3] opacity-50 mx-1" />
          <View className="h-[6px] w-10 rounded-full bg-[#16a8e3] mx-1" />
        </View>
      </SafeAreaView>
    </View>
  );
}
