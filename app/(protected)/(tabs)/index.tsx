import { useAuthStore } from "@/store/useAuthStore";
import { LogOut } from "lucide-react-native";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function DashboardScreen() {
  const { signOut, user } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out and clear your data?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await signOut();
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 justify-center items-center bg-[#f8f9fa] px-8">
      <View className="bg-white p-8 rounded-3xl shadow-sm w-full items-center">
        <Text className="text-[#0a4a6e] font-bold text-2xl mb-2 text-center">
          Welcome Back!
        </Text>
        <Text className="text-gray-500 text-center mb-2">Logged in as:</Text>

        <Text className="text-gray-500 text-center mb-8">{user?.email}</Text>

        <TouchableOpacity
          onPress={handleSignOut}
          className="flex-row items-center bg-red-50 px-6 py-4 rounded-xl border border-red-100"
        >
          <LogOut size={20} color="#ef4444" className="mr-3" />
          <Text className="text-red-500 font-bold text-lg">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
