import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { setIsVerifying } = useAuthStore();

  const handleVerify = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    setLoading(true);
    setIsVerifying(true); // Enter Silent Mode to ignore auth events

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "signup",
      });

      if (error) {
        Alert.alert("Verification Error", error.message);
      } else {
        Alert.alert("Success", "Account verified! You can now log in.");
        router.replace("/auth/login");
      }
    } catch {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsVerifying(false); // Exit Silent Mode
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#f8f9fa]">
      <Image
        source={require("@/assets/images/login.png")}
        style={{ width: width, height: height, opacity: 0.1 }}
        className="absolute left-0 top-40"
        resizeMode="contain"
      />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 px-8"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 w-10 h-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ChevronLeft size={24} color="#0a4a6e" />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Logo and Branding */}
            <View className="items-center mt-4">
              <View className="flex-row items-center">
                <Image
                  source={require("@/assets/images/carIcon.png")}
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

            <View className="mt-10">
              <Text className="text-[#0a4a6e] text-[32px] font-bold text-center">
                Verify Email
              </Text>
              <Text className="text-gray-500 text-center mt-2">
                Enter the code sent to {email}
              </Text>
            </View>

            {/* Input Fields */}
            <View className="mt-8">
              <Text className="text-[#16a8e3] font-bold mb-2 ml-1">
                Verification Code
              </Text>
              <TextInput
                placeholder="123456"
                value={otp}
                onChangeText={setOtp}
                className="px-4 py-4 mb-5 text-gray-700 bg-white border border-gray-300 rounded-xl"
                keyboardType="number-pad"
              />
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              onPress={handleVerify}
              disabled={loading}
              className={`rounded-xl py-4 mt-8 shadow-md ${
                loading ? "bg-gray-400" : "bg-[#16a8e3]"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-xl font-bold text-center text-white">
                  Verify Now
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-6"
              onPress={() =>
                Alert.alert(
                  "Coming soon!",
                  "Resend code functionality is coming.",
                )
              }
            >
              <Text className="text-center text-gray-500 font-medium">
                Didn{"'"}t receive a code?{" "}
                <Text className="text-[#16a8e3] font-bold">Resend</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
