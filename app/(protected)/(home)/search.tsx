import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import {
  ArrowUpDown,
  Bookmark,
  ChevronDown,
  LayoutGrid,
  MapPin,
  Star,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

// Clean interface using the Database View structure
interface CarListItem {
  id: string;
  brand: string;
  model: string;
  price_per_day: number;
  location: string;
  status: string;
  car_type: string;
  seats: number;
  avg_rating: number;
  review_count: number;
  primary_image_url: string;
}

export default function SearchScreen() {
  const router = useRouter();
  const [cars, setCars] = useState<CarListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All Cars");

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("car_details_view") // Changed from 'car_search_view' to 'car_details_view'
      .select("*")
      .eq("status", "Available")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching from view:", error.message);
    } else {
      setCars(data || []);
    }
    setLoading(false);
  };
  const renderHeader = () => (
    <View className="px-4 bg-white">
      {/* Filter Card (The Light Blue Box) */}
      <View className="bg-cyan-50/40 px-5 pt-4 rounded-[32px] mb-6 border border-cyan-50">
        <Text className="mb-2 ml-1 font-bold text-slate-800">Car Location</Text>
        <View className="flex-row items-center p-4 mb-5 bg-white border shadow-sm rounded-2xl border-slate-100 shadow-slate-100">
          <MapPin size={20} color="#06b6d4" />
          <Text className="flex-1 ml-3 text-slate-400">Select Location</Text>
          <ChevronDown size={20} color="#9ca3af" />
        </View>

        <View className="flex-row justify-between mb-5">
          <View className="w-[48%]">
            <Text className="mb-2 ml-1 font-bold text-slate-800">
              Pick-up Date
            </Text>
            <View className="p-4 bg-white border shadow-sm rounded-2xl border-slate-100 shadow-slate-100">
              <Text className="text-slate-300">yyyy/mm/dd</Text>
            </View>
          </View>
          <View className="w-[48%]">
            <Text className="mb-2 ml-1 font-bold text-slate-800">
              Return Date
            </Text>
            <View className="p-4 bg-white border shadow-sm rounded-2xl border-slate-100 shadow-slate-100">
              <Text className="text-slate-300">yyyy/mm/dd</Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center justify-between mb-2">
          <Text className="font-bold text-slate-800">Price per Day (MMK)</Text>
          <Text className="font-extrabold text-cyan-600">
            100,000 - 500,000
          </Text>
        </View>

        {/* Slider Simulation */}
        <View className="justify-center h-8 mb-4">
          <View className="h-[4px] bg-slate-200 rounded-full w-full">
            <View className="relative w-3/4 h-full rounded-full bg-cyan-400">
              <View className="absolute w-5 h-5 border-2 border-white rounded-full shadow-md -right-2 -top-2 bg-cyan-500" />
            </View>
          </View>
        </View>

        <View className="flex-row justify-between mt-2">
          <Pressable className="w-[47%] py-4 rounded-2xl border border-cyan-400 bg-white items-center">
            <Text className="text-lg font-bold text-cyan-500">Reset</Text>
          </Pressable>
          <Pressable className="w-[47%] py-4 rounded-2xl bg-cyan-500 items-center shadow-lg shadow-cyan-100">
            <Text className="text-lg font-bold text-white">Search</Text>
          </Pressable>
        </View>
      </View>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-6"
      >
        {["All Cars", "SUV", "Sedan", "Van", "Luxury"].map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setCategory(cat)}
            className={`px-7 py-3 rounded-full mr-3 border ${category === cat ? "bg-cyan-500 border-cyan-500" : "bg-white border-slate-200"}`}
          >
            <Text
              className={`${category === cat ? "text-white" : "text-slate-500"} font-bold`}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Result Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-extrabold text-slate-900">
          {cars.length} Cars Available
        </Text>
        <View className="flex-row items-center">
          <LayoutGrid size={22} color="#06b6d4" />
          <Text className="mx-2 text-base font-bold text-cyan-500">Sort</Text>
          <ArrowUpDown size={18} color="#06b6d4" />
        </View>
      </View>
    </View>
  );

  const renderCarCard = ({ item }: { item: CarListItem }) => (
    <Pressable
      style={{ width: CARD_WIDTH }}
      className="bg-white rounded-[32px] p-4 mb-4 mx-2 shadow-sm border border-slate-50"
      onPress={() => router.push(`/(protected)/car/${item.id}`)}
    >
      <View className="flex-row items-center justify-between mb-1">
        <View className="flex-row items-center">
          <Star size={12} color="#facc15" fill="#facc15" />
          <Text className="text-[10px] text-slate-400 ml-1 font-bold">
            {Number(item.avg_rating).toFixed(1)} ({item.review_count} reviews)
          </Text>
        </View>
        <Bookmark size={18} color="#06b6d4" />
      </View>

      <View className="items-center justify-center w-full h-24 my-2">
        <Image
          source={{ uri: item.primary_image_url }}
          className="w-full h-full"
          resizeMode="contain"
        />
      </View>

      <View className="flex-row items-start justify-between mt-1">
        <View className="flex-1">
          <Text
            className="font-bold text-slate-900 text-[13px]"
            numberOfLines={1}
          >
            {item.brand}
          </Text>
          <Text className="text-slate-400 text-[10px] font-bold">
            {item.model}
          </Text>
        </View>
        <View className="items-end">
          <Text className="font-extrabold text-slate-900 text-[13px]">
            {item.price_per_day.toLocaleString()}
          </Text>
          <Text className="text-slate-400 text-[8px] font-bold">MMK / Day</Text>
        </View>
      </View>

      <View className="flex-row justify-between pt-3 mt-4 border-t border-slate-50">
        <Text className="text-[9px] text-slate-500 font-bold uppercase">
          🚙 {item.car_type || "Sedan"}
        </Text>
        <Text className="text-[9px] text-slate-500 font-bold uppercase">
          👤 {item.seats || 4} seats
        </Text>
      </View>

      <Text className="text-cyan-500 text-center font-extrabold text-[11px] mt-4">
        View Details →
      </Text>
    </Pressable>
  );

  return (
    <View className="flex-1 pt-4 bg-white">
      {loading ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#06b6d4" />
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={renderHeader}
          data={cars}
          renderItem={renderCarCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          columnWrapperStyle={{
            justifyContent: "center",
            paddingHorizontal: 8,
          }}
        />
      )}
    </View>
  );
}
