import { useAuthStore } from '@/store/useAuthStore';
import { LogOut, ChevronLeft } from 'lucide-react-native';
import { Text, View, TouchableOpacity, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { signOut, user, role } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          style: "destructive",
          onPress: async () => {
            await signOut();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8f9fa]">
      <View className="flex-row items-center px-6 py-4">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ChevronLeft size={24} color="#0a4a6e" />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-bold text-[#0a4a6e]">Profile</Text>
      </View>

      <View className="items-center mt-10 px-8">
        <View className="relative">
          <Image 
            source={{ uri: user?.user_metadata?.avatar_url || 'https://via.placeholder.com/128' }} 
            className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-gray-200" 
          />
        </View>

        <Text className="mt-6 text-2xl font-bold text-[#0a4a6e]">
          {user?.user_metadata?.full_name || 'User'}
        </Text>
        <Text className="text-gray-500 mt-1">{user?.email}</Text>
        
        <View className="mt-4 px-4 py-1 bg-[#e1f6fd] rounded-full">
          <Text className="text-[#16a8e3] font-bold text-xs uppercase tracking-widest">
            {role || 'Renter'}
          </Text>
        </View>

        {/* Profile Options */}
        <View className="w-full mt-10 gap-y-4">
          <TouchableOpacity className="w-full flex-row items-center justify-between p-5 bg-white rounded-2xl shadow-sm">
            <Text className="font-semibold text-[#0a4a6e]">Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="w-full flex-row items-center justify-between p-5 bg-white rounded-2xl shadow-sm">
            <Text className="font-semibold text-[#0a4a6e]">Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleSignOut}
            className="w-full flex-row items-center justify-center p-5 bg-red-50 border border-red-100 rounded-2xl mt-4"
          >
            <LogOut size={20} color="#ef4444" className="mr-3" />
            <Text className="text-red-500 font-bold">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

