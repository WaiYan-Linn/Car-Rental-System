import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert("Login failed!", error.message);
        setLoading(false);
        return;
      }

      if (session) {
        // Successful login, router will handle redirect or user can redirect manually
        console.log("success");
        router.replace("/(protected)/(tabs)");
      }
    } catch {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "carrentalpractice://auth", // Match your app.json scheme
        },
      });

      if (error) throw error;
      // On success, this will open a browser for the user to log in
    } catch (error: any) {
      Alert.alert("Google Login Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#f8f9fa]">
      {/* 1. Asset Image (Car Tail) */}
      <Image
        source={require("@/assets/images/login.png")}
        style={{ width: width, height: height }}
        className="absolute left-0 top-40"
        resizeMode="contain"
      />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 px-8"
        >
          {/* ScrollView for better flexibility */}
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            {/* 2. Logo and Branding */}
            <View className="items-center mt-10">
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
                editable={!loading}
              />

              {/* Password Field */}
              <Text className="text-[#16a8e3] font-bold mb-2 ml-1">
                Password
              </Text>
              <View className="relative">
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  className="px-4 py-4 text-gray-700 bg-white border border-gray-300 rounded-xl"
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  className="absolute right-4 top-4"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye size={20} color="#9ca3af" />
                  ) : (
                    <EyeOff size={20} color="#9ca3af" />
                  )}
                </TouchableOpacity>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity
                className="self-end mt-4"
                onPress={() =>
                  Alert.alert(
                    "Coming soon!",
                    "Password reset is not implemented yet.",
                  )
                }
                disabled={loading}
              >
                <Text className="text-[#16a8e3] font-medium">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* 5. Sign In Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className={`rounded-xl py-4 mt-4 shadow-md ${
                loading ? "bg-gray-400" : "bg-[#16a8e3]"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-xl font-bold text-center text-white">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            {/* OR Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="mx-4 text-gray-500 font-medium">OR</Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            {/* Google Login Button */}
            <TouchableOpacity
              onPress={handleGoogleLogin}
              disabled={loading}
              className="flex-row items-center justify-center bg-white border border-gray-200 rounded-xl py-4 shadow-sm"
            >
              <Text className="text-gray-700 font-bold ml-2 text-lg">
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* 6. Sign Up Link */}
            <View className="flex-row justify-center mt-8 mb-10">
              <Text className="text-gray-500 font-medium">
                Don{"'"}t have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/auth/signup")}
                disabled={loading}
              >
                <Text className="text-[#16a8e3] font-bold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
