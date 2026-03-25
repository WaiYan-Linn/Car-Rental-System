import { router, Stack } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTintColor: "#16a8e3",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
      <Stack.Screen
        name="search"
        options={{
          title: "Explore Cars",
          headerShown: true,
          headerShadowVisible: false, // Removes the line under the header
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "System", // Or your custom font
            fontWeight: "bold",
            fontSize: 20,
            color: "#16A8E3", // The Cyan color from your screenshot
          },
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              className="p-2 mt-0.5 ml-2 border rounded-full border-cyan-200"
            >
              <ChevronLeft size={24} color="#16A8E3" />
            </Pressable>
          ),
        }}
      />{" "}
      <Stack.Screen name="notifications" options={{ title: "Notifications" }} />
    </Stack>
  );
}
