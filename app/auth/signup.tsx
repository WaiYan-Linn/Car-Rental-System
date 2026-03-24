import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { ChevronLeft, Eye, EyeOff } from "lucide-react-native";
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

export default function SignupScreen() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nrc, setNrc] = useState("");
  const [gender, setGender] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const handleSignup = async () => {
    // Validation
    if (!fullName || !email || !password || !nrc || !gender || !postalCode) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          nrc,
          gender,
          postal_code: postalCode,
          role: "user",
        },
      },
    });

    if (error) {
      Alert.alert("Signup failed!", error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    // Redirect to Verify Screen with the email
    router.push({ pathname: "/auth/verify", params: { email } });
  };

  return (
    <View className="flex-1 bg-[#f8f9fa]">
      <Image
        source={require("@/assets/images/login.png")}
        style={{ width: width, height: height }}
        className="absolute left-0 top-40"
        resizeMode="contain"
      />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
          className="px-8"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 w-10 h-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ChevronLeft size={24} color="#0a4a6e" />
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 50 }}
          >
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

            <View className="mt-8">
              <Text className="text-[#0a4a6e] text-[28px] font-bold text-center">
                Create Account
              </Text>
              <Text className="text-gray-500 text-center mt-1">
                Join us to start your journey
              </Text>
            </View>

            {/* Input Fields */}
            <View className="mt-6">
              <InputField
                label="Full Name"
                placeholder="John Doe"
                value={fullName}
                onChange={setFullName}
              />

              <InputField
                label="Email"
                placeholder="example@mail.com"
                value={email}
                onChange={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Text className="text-[#16a8e3] font-bold mb-2 ml-1">
                Password
              </Text>
              <View className="relative mb-5">
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

              <InputField
                label="NRC Number"
                placeholder="12/YAKANA(N)123456"
                value={nrc}
                onChange={setNrc}
              />

              <View className="flex-row justify-between">
                <View style={{ width: "48%" }}>
                  <InputField
                    label="Gender"
                    placeholder="Male/Female"
                    value={gender}
                    onChange={setGender}
                  />
                </View>
                <View style={{ width: "48%" }}>
                  <InputField
                    label="Postal Code"
                    placeholder="11011"
                    value={postalCode}
                    onChange={setPostalCode}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleSignup}
              disabled={loading}
              className={`rounded-xl py-4 mt-4 shadow-md ${loading ? "bg-gray-400" : "bg-[#16a8e3]"}`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-xl font-bold text-center text-white">
                  Next
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6 mb-10">
              <Text className="text-gray-500 font-medium">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/auth/login")}>
                <Text className="text-[#16a8e3] font-bold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// Small helper component to keep the code clean
const InputField = ({ label, value, onChange, placeholder, ...props }: any) => (
  <View className="mb-5">
    <Text className="text-[#16a8e3] font-bold mb-2 ml-1">{label}</Text>
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChange}
      className="px-4 py-4 text-gray-700 bg-white border border-gray-300 rounded-xl"
      {...props}
    />
  </View>
);
