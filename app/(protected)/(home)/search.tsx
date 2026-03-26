import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import {
  ArrowUpDown,
  Bookmark,
  ChevronDown,
  LayoutGrid,
  LayoutList,
  MapPin,
  Star,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
// CARD_WIDTH will be dynamic inside the component

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
  const [categories, setCategories] = useState<string[]>(["All Cars"]);
  const [location, setLocation] = useState("All Locations");
  const [locations, setLocations] = useState<string[]>(["All Locations"]);
  const [numColumns, setNumColumns] = useState(2);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const cardWidth = numColumns === 1 ? width - 32 : (width - 48) / 2;

  useEffect(() => {
    fetchCars();
    fetchCategories();
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("location")
        .not("location", "is", null);

      if (error) throw error;

      if (data) {
        const uniqueLocations = [
          ...new Set(data.map((item) => item.location)),
        ] as string[];
        setLocations(["All Locations", ...uniqueLocations.sort()]);
      }
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("car_type")
        .not("car_type", "is", null);

      if (error) throw error;

      if (data) {
        const uniqueTypes = [
          ...new Set(data.map((item) => item.car_type)),
        ] as string[];
        setCategories(["All Cars", ...uniqueTypes.sort()]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchCars = async (selectedCategory?: string) => {
    setLoading(true);
    let query = supabase
      .from("car_details_view")
      .select("*")
      .eq("status", "Available")
      .order("created_at", { ascending: false });

    const currentCat = selectedCategory || category;
    if (currentCat !== "All Cars") {
      query = query.eq("car_type", currentCat);
    }

    if (location !== "All Locations") {
      query = query.eq("location", location);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching from view:", error.message);
    } else {
      setCars(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCars();
  }, [category]);
  const renderHeader = () => (
    <View className="px-4 bg-white">
      {/* Filter Card (The Light Blue Box) */}
      <View className="bg-cyan-50/40 px-5 pt-4 rounded-[32px] mb-6 border border-cyan-50">
        <Text className="mb-2 ml-1 font-bold text-slate-800">Car Location</Text>
        <View className="relative">
          <Pressable
            onPress={() => setShowLocationDropdown(!showLocationDropdown)}
            className="flex-row items-center p-4 mb-5 bg-white border shadow-sm rounded-2xl border-slate-100 shadow-slate-100"
          >
            <MapPin size={20} color="#06b6d4" />
            <Text className="flex-1 ml-3 text-slate-800">
              {location === "All Locations" ? "Select Location" : location}
            </Text>
            <ChevronDown size={20} color="#9ca3af" />
          </Pressable>

          {showLocationDropdown && (
            <Modal
              transparent={true}
              visible={showLocationDropdown}
              animationType="fade"
              onRequestClose={() => setShowLocationDropdown(false)}
            >
              <Pressable
                className="flex-1 justify-center items-center bg-black/10"
                onPress={() => setShowLocationDropdown(false)}
              >
                <View className="bg-white w-[80%] rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[60%]">
                  <ScrollView>
                    {locations.map((loc) => (
                      <Pressable
                        key={loc}
                        onPress={() => {
                          setLocation(loc);
                          setShowLocationDropdown(false);
                        }}
                        className={`flex-row items-center p-4 border-b border-slate-50 ${location === loc ? "bg-cyan-50" : ""}`}
                      >
                        <Text
                          className={`flex-1 font-bold ${location === loc ? "text-cyan-600" : "text-slate-600"}`}
                        >
                          {loc}
                        </Text>
                        {location === loc && (
                          <View className="w-2 h-2 rounded-full bg-cyan-500" />
                        )}
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              </Pressable>
            </Modal>
          )}
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
          <Pressable
            onPress={() => {
              setLocation("All Locations");
              setCategory("All Cars");
              fetchCars("All Cars");
            }}
            className="w-[47%] py-4 rounded-2xl border border-cyan-400 bg-white items-center"
          >
            <Text className="text-lg font-bold text-cyan-500">Reset</Text>
          </Pressable>
          <Pressable
            onPress={() => fetchCars()}
            className="w-[47%] py-4 rounded-2xl bg-cyan-500 items-center shadow-lg shadow-cyan-100"
          >
            <Text className="text-lg font-bold text-white">Search</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-6"
      >
        {categories.map((cat) => (
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
      <View className="flex-row items-center justify-between mb-4 mt-2">
        <Text className="text-lg font-extrabold text-slate-900">
          {cars.length} Cars Available
        </Text>
        <View className="relative">
          <Pressable
            onPress={() => setShowSortDropdown(!showSortDropdown)}
            className="flex-row items-center bg-cyan-50 px-3 py-2 rounded-xl border border-cyan-100"
          >
            {numColumns === 1 ? (
              <LayoutList size={20} color="#06b6d4" />
            ) : (
              <LayoutGrid size={20} color="#06b6d4" />
            )}
            <Text className="mx-2 text-sm font-bold text-cyan-500">Sort</Text>
            <ArrowUpDown size={16} color="#06b6d4" />
          </Pressable>

          {showSortDropdown && (
            <Modal
              transparent={true}
              visible={showSortDropdown}
              animationType="fade"
              onRequestClose={() => setShowSortDropdown(false)}
            >
              <Pressable
                className="flex-1"
                onPress={() => setShowSortDropdown(false)}
              >
                {/* Backdrop effect optional, but keeping it fully transparent as requested for "just a dropdown" */}
                <View
                  className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                  style={{
                    position: "absolute",
                    top: 510, // Approximate position based on search filter height
                    right: 16,
                    width: 200,
                    elevation: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.2,
                    shadowRadius: 20,
                  }}
                >
                  <Pressable
                    onPress={() => {
                      setNumColumns(1);
                      setShowSortDropdown(false);
                    }}
                    className={`flex-row items-center p-4 border-b border-slate-50 ${numColumns === 1 ? "bg-cyan-50" : ""}`}
                  >
                    <LayoutList
                      size={18}
                      color={numColumns === 1 ? "#06b6d4" : "#64748b"}
                    />
                    <Text
                      className={`ml-3 font-bold ${numColumns === 1 ? "text-cyan-600" : "text-slate-600"}`}
                    >
                      One Column View
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setNumColumns(2);
                      setShowSortDropdown(false);
                    }}
                    className={`flex-row items-center p-4 ${numColumns === 2 ? "bg-cyan-50" : ""}`}
                  >
                    <LayoutGrid
                      size={18}
                      color={numColumns === 2 ? "#06b6d4" : "#64748b"}
                    />
                    <Text
                      className={`ml-3 font-bold ${numColumns === 2 ? "text-cyan-600" : "text-slate-600"}`}
                    >
                      Two Column View
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            </Modal>
          )}
        </View>
      </View>
    </View>
  );

  const renderCarCard = ({ item }: { item: CarListItem }) => (
    <Pressable
      // 1. Ensure width is 100% for 1 column, otherwise use calculated width
      style={{ width: numColumns === 1 ? "100%" : cardWidth }}
      // 2. Remove flex-row (which forces side-by-side) and use flex-col for the vertical look
      className={`bg-white rounded-[32px] p-4 mb-4 shadow-sm border border-slate-100 ${
        numColumns === 1 ? "flex-col" : "mx-2"
      }`}
      onPress={() => router.push(`/(protected)/car/${item.id}`)}
    >
      {numColumns === 1 ? (
        // Removed the nested extra View to prevent double-bordering
        <>
          {/* Top Section: Rating and Bookmark */}
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center bg-slate-50 px-2 py-1 rounded-full">
              <Star size={12} color="#facc15" fill="#facc15" />
              <Text className="text-[10px] text-slate-700 ml-1 font-bold">
                {Number(item.avg_rating).toFixed(1)} ({item.review_count}{" "}
                reviews)
              </Text>
            </View>
            <View className="bg-cyan-50 p-2 rounded-full">
              <Bookmark size={18} color="#06b6d4" />
            </View>
          </View>

          {/* Center Section: Large Image */}
          <View className="items-center justify-center w-full h-44 ">
            <View className="items-center justify-center w-60 h-44">
              <Image
                source={{ uri: item.primary_image_url }}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Info Section: Brand and Price */}
          <View className="flex-row justify-between items-end mb-4">
            <View>
              <View className="flex-row items-baseline">
                <Text className="font-bold text-slate-900 text-xl">
                  {item.brand}
                </Text>
                <Text className="text-slate-400 text-sm ml-2">
                  {item.model}
                </Text>
              </View>
              <View className="flex-row items-center mt-1">
                <Text className="text-slate-500 text-xs">
                  🚗 {item.car_type || "SUV"}
                </Text>
                <Text className="text-slate-500 text-xs ml-3">
                  👤 {item.seats || 4} seats
                </Text>
              </View>
            </View>

            <View className="items-end">
              <Text className="font-extrabold text-slate-900 text-xl">
                {item.price_per_day.toLocaleString()}
              </Text>
              <Text className="text-slate-400 text-[10px] font-bold">
                MMK / Day
              </Text>
            </View>
          </View>

          {/* Bottom Section: Action Link */}
          <View className="border-t border-slate-50 pt-3 items-center">
            <Text className="text-cyan-500 font-bold text-sm">
              View Details →
            </Text>
          </View>
        </>
      ) : (
        <>
          <View className="flex-row items-center justify-between mb-1">
            <View className="flex-row items-center">
              <Star size={12} color="#facc15" fill="#facc15" />
              <Text className="text-[10px] text-slate-400 ml-1 font-bold">
                {Number(item.avg_rating).toFixed(1)} ({item.review_count}{" "}
                reviews)
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
              <Text className="text-slate-400 text-[8px] font-bold">
                MMK / Day
              </Text>
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
        </>
      )}
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
          key={`list-${numColumns}`}
          ListHeaderComponent={renderHeader}
          data={cars}
          renderItem={renderCarCard}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          columnWrapperStyle={
            numColumns > 1
              ? {
                  justifyContent: "flex-start",
                  paddingHorizontal: 8,
                }
              : undefined
          }
        />
      )}
    </View>
  );
}
