import { NRC_SHORTHANDS, YANGON_TOWNSHIPS } from "@/constants/constants";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function CompleteProfileScreen() {
  const router = useRouter();
  const { user, initialize } = useAuthStore();

  // States
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [nrcShort, setNrcShort] = useState("Tha Ka Ta");
  const [nrcNumber, setNrcNumber] = useState("");
  const [gender, setGender] = useState("Male");
  const [selectedTownship, setSelectedTownship] = useState<{
    name: string;
    postal: string;
  } | null>(null);
  const [address, setAddress] = useState("");

  // Modal States
  const [showNrcModal, setShowNrcModal] = useState(false);
  const [showTownModal, setShowTownModal] = useState(false);

  const handleRegister = async () => {
    if (!nrcNumber || !selectedTownship) {
      Alert.alert("Error", "Please fill in required fields (*)");
      return;
    }

    setLoading(true);
    const fullNrc = `12/${nrcShort}(N)${nrcNumber}`;

    const { error } = await supabase
      .from("profiles")
      .update({
        phone,
        nrc: fullNrc,
        gender,
        postal_code: selectedTownship.postal,
        location: address,
        role: "user",
      })
      .eq("id", user?.id);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      await initialize();
      router.replace("/(protected)/(tabs)");
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView showsVerticalScrollIndicator={false} className="px-8">
            {/* Header Logo & Welcome */}
            <View className="items-center mt-6">
              <Image
                source={require("@/assets/images/carIcon.png")}
                className="w-16 h-8"
                resizeMode="contain"
              />
              <Text className="text-xs font-bold text-gray-800">
                CAR <Text className="text-sky-400">RENTAL</Text> APP
              </Text>
              <Text className="mt-10 text-3xl font-bold text-sky-400">
                Welcome!
              </Text>
              <Text className="mt-2 text-lg text-center text-gray-500">
                Hello,{" "}
                <Text className="font-bold text-sky-600">
                  {user?.user_metadata?.full_name || "User"}
                </Text>
                !
              </Text>
              <Text className="text-sm text-gray-400">
                You've successfully registered with
              </Text>
              <Text className="text-sm italic text-sky-600">{user?.email}</Text>
            </View>

            <Text className="mt-10 mb-4 text-xl font-bold text-gray-600">
              Complete your profile.
            </Text>

            {/* Phone Number */}
            <Text className="mb-2 font-bold text-gray-700">Phone Number</Text>
            <TextInput
              placeholder="Enter your phone number"
              className="p-3 mb-4 border border-gray-200 rounded-lg"
              onChangeText={setPhone}
            />

            {/* NRC Number Group - Matching Screenshot Layout */}
            <Text className="mb-2 font-bold text-gray-700">
              NRC Number <Text className="text-red-500">*</Text>
            </Text>
            <View className="flex-row items-center mb-4 space-x-1">
              <View className="flex-1 p-3 bg-white border border-gray-200 rounded-lg">
                <Text className="text-center text-gray-700">12</Text>
              </View>
              <Text className="text-lg">/</Text>
              {/* NRC Shorthand Dropdown */}
              <Pressable
                onPress={() => setShowNrcModal(true)}
                className="flex-[2] border border-gray-200 rounded-lg p-3 bg-white flex-row justify-between items-center"
              >
                <Text className="text-gray-700">{nrcShort}</Text>
                <Text className="text-[10px] text-gray-400">▼</Text>
              </Pressable>
              <View className="flex-1 p-3 bg-white border border-gray-200 rounded-lg">
                <Text className="text-center text-gray-700">(N)</Text>
              </View>
              <TextInput
                placeholder="123456"
                className="flex-[2] border border-gray-200 rounded-lg p-3 bg-white text-gray-700"
                onChangeText={setNrcNumber}
                keyboardType="number-pad"
              />
            </View>

            {/* Gender */}
            <Text className="mb-2 font-bold text-gray-700">
              Gender <Text className="text-red-500">*</Text>
            </Text>
            <View className="flex-row mb-4 space-x-10">
              {["Male", "Female"].map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setGender(item)}
                  className="flex-row items-center"
                >
                  <View
                    className={`h-6 w-6 rounded-full border-2 border-gray-800 items-center justify-center mr-2`}
                  >
                    {gender === item && (
                      <View className="w-3 h-3 bg-gray-800 rounded-full" />
                    )}
                  </View>
                  <Text className="text-lg text-gray-700">{item}</Text>
                </Pressable>
              ))}
            </View>

            {/* Township Dropdown (Independent) */}
            <Text className="mb-2 font-bold text-gray-700">
              Township <Text className="text-red-500">*</Text>
            </Text>
            <Pressable
              onPress={() => setShowTownModal(true)}
              className="flex-row items-center justify-between p-4 mb-4 border border-gray-200 rounded-lg"
            >
              <Text
                className={selectedTownship ? "text-gray-800" : "text-gray-400"}
              >
                {selectedTownship
                  ? selectedTownship.name
                  : "Select your township name"}
              </Text>
              <Text className="text-gray-400">▼</Text>
            </Pressable>

            {/* Address */}
            <Text className="mb-2 font-bold text-gray-700">Address</Text>
            <TextInput
              placeholder="Enter your detail address"
              className="h-24 p-4 mb-8 border border-gray-200 rounded-lg"
              multiline
              onChangeText={setAddress}
            />

            {/* Register Button */}
            <Pressable
              onPress={handleRegister}
              disabled={loading}
              className="bg-[#00adef] rounded-lg py-4 items-center mb-10"
            >
              <Text className="text-lg font-bold text-white">Register</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* NRC SHORTHAND MODAL */}
      <Modal visible={showNrcModal} transparent animationType="fade">
        <Pressable
          onPress={() => setShowNrcModal(false)}
          className="justify-center flex-1 px-10 bg-black/30"
        >
          <View className="bg-white rounded-2xl p-4 max-h-[50%]">
            <FlatList
              data={NRC_SHORTHANDS}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setNrcShort(item);
                    setShowNrcModal(false);
                  }}
                  className="py-4 border-b border-gray-100"
                >
                  <Text className="font-bold text-center text-gray-700">
                    {item}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      {/* TOWNSHIP MODAL */}
      <Modal visible={showTownModal} transparent animationType="fade">
        <Pressable
          onPress={() => setShowTownModal(false)}
          className="justify-center flex-1 px-10 bg-black/30"
        >
          <View className="bg-white rounded-2xl p-4 max-h-[60%]">
            <FlatList
              data={YANGON_TOWNSHIPS}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setSelectedTownship(item);
                    setShowTownModal(false);
                  }}
                  className="py-4 border-b border-gray-100"
                >
                  <Text className="text-center text-gray-700">{item.name}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
