import { router } from "expo-router";
import { EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 bg-[#f8f9fa]">
      {/* 1. Asset Image (Car Tail) - Positioned at bottom per Figma */}
      <Image
        source={require("@/assets/images/login.png")} // Replace with your car tail asset
        style={{ width: width, height: height }}
        className="absolute left-0 top-40"
        resizeMode="contain"
      />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 px-8"
        >
          {/* 2. Logo and Branding */}
          <View className="items-center mt-10">
            <View className="flex-row items-center">
              <Image
                source={require("@/assets/images/carIcon.png")} // Rplace with your car icon asset
                className="w-12 h-6"
                resizeMode="contain"
              />
            </View>
            <View className="flex-row mt-2">
              <Text className="text-sm font-bold tracking-widest text-black">
                CAR{" "}
              </Text>
              <Text className="text-[#16a8e3] font-bold text-sm tracking-widest">
                RENTAL{" "}
              </Text>
              <Text className="text-sm font-bold tracking-widest text-black">
                APP
              </Text>
            </View>
          </View>

          {/* 3. Header Text */}
          <View className="mt-16">
            <Text className="text-[#0a4a6e] text-[32px] font-bold text-center">
              Sign In to your Account
            </Text>
          </View>

          {/* 4. Input Fields */}
          <View className="mt-10">
            {/* Email Field */}
            <Text className="text-[#16a8e3] font-bold mb-2 ml-1">Email</Text>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              className="px-4 py-4 mb-6 text-gray-700 bg-white border border-gray-300 rounded-xl"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            {/* Password Field */}
            <Text className="text-[#16a8e3] font-bold mb-2 ml-1">Password</Text>
            <View className="relative">
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                className="px-4 py-4 text-gray-700 bg-white border border-gray-300 rounded-xl"
                secureTextEntry
              />
              <TouchableOpacity className="absolute right-4 top-4">
                <EyeOff size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity className="self-end mt-4">
              <Text className="text-[#16a8e3] font-medium">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* 5. Sign In Button */}
          <TouchableOpacity
            onPress={() => router.replace("/")}
            className="bg-[#16a8e3] rounded-xl py-4 mt-8 shadow-md"
          >
            <Text className="text-xl font-bold text-center text-white">
              Sign In
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
