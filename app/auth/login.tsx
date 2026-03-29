import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import * as AuthSession from "expo-auth-session";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
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

WebBrowser.maybeCompleteAuthSession();
const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Use the store's initialize to force-sync data after login
  const { initialize } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert("Login failed!", error.message);
        setLoading(false);
        return;
      }

      // Sync the "Brain" immediately.
      // The ProtectedLayout will detect the state change and redirect for us.
      await initialize();
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const redirectTo = AuthSession.makeRedirectUri({
        scheme: "carrentalpractice",
        path: "auth",
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo, skipBrowserRedirect: true },
      });

      if (error) throw error;

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo,
      );

      if (result.type === "success") {
        const params = new URLSearchParams(result.url.split("#")[1]);
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");

        if (access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token });
          // Force fetch the profile so the Gatekeeper knows if NRC is missing
          await initialize();
        }
      }
    } catch (error: any) {
      Alert.alert("Login Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#f8f9fa]">
      <Image
        source={require("@/assets/images/login.png")}
        style={{ width: width, height: height, opacity: 0.4 }}
        className="absolute left-0 top-40 "
        resizeMode="contain"
      />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 px-8"
        >
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            <View className="items-center mt-6">
              {/* Car Logo UI */}
              <Image
                source={require("@/assets/images/carIcon.png")}
                className="w-12 h-6"
                resizeMode="contain"
              />
              <View className="flex-row mt-2">
                <Text className="text-sm font-bold tracking-widest text-black">
                  CAR RENTAL APP
                </Text>
              </View>
            </View>

            <View className="mt-4">
              <Text className="text-[#0a4a6e] text-[32px] font-bold text-center">
                Sign In to your Account
              </Text>
            </View>

            {/* Inputs */}
            <View className="mt-6">
              <Text className="text-[#16a8e3] font-bold mb-2 ml-1">Email</Text>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                className="px-4 py-4 mb-6 text-gray-700 bg-white border border-gray-300 rounded-xl"
                autoCapitalize="none"
              />

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
            </View>

            {/* Buttons */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className={`rounded-xl py-4 mt-6 shadow-md ${loading ? "bg-gray-400" : "bg-[#16a8e3]"}`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-xl font-bold text-center text-white">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex-row items-center my-4">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="mx-4 font-medium text-gray-500">OR</Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            <TouchableOpacity
              onPress={handleGoogleLogin}
              disabled={loading}
              className="flex-row items-center justify-center py-4 bg-white border border-gray-200 shadow-sm rounded-xl"
            >
              <Image
                source={{ uri: "https://authjs.dev/img/providers/google.svg" }}
                className="w-6 h-6 mr-3"
              />
              <Text className="text-lg font-bold text-gray-700">
                Continue with Google
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-4 mb-10">
              <Text className="font-medium text-gray-500">
                Don't have an account?{" "}
              </Text>
              <Link href="/auth/signup" asChild>
                <TouchableOpacity disabled={loading}>
                  <Text className="text-[#16a8e3] font-bold">Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
