import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Fuel,
  Gauge,
  MapPin,
  Star,
  Users
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

interface CarDetail {
  id: string;
  brand: string;
  model: string;
  price_per_day: number;
  location: string;
  description?: string;
  car_type?: string;
  seats?: number;
  transmission?: string;
  fuel_type?: string;
  car_images: { image_url: string }[];
}

export default function CarDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [car, setCar] = useState<CarDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cars")
      .select(
        `
        *,
        car_images ( image_url )
      `,
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching car:", error.message);
    } else {
      setCar(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#06b6d4" />
      </View>
    );
  }

  if (!car) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>Car not found</Text>
      </View>
    );
  }

  const primaryImage = car.car_images?.[0]?.image_url;

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View className="bg-slate-50 items-center justify-center pt-20 pb-10">
          <View className="items-center justify-center w-60 h-44">
            {primaryImage ? (
              <Image
                source={{ uri: primaryImage }}
                className="w-full h-64"
                resizeMode="contain"
              />
            ) : (
              <View className="h-64 justify-center">
                <Text className="text-slate-400">No Image Available</Text>
              </View>
            )}
          </View>
        </View>

        {/* Content Section */}
        <View className="px-6 py-6 bg-white -mt-8 rounded-t-[40px] shadow-xl">
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-3xl font-bold text-slate-900">
                {car.brand}
              </Text>
              <Text className="text-xl text-slate-500 mb-2">{car.model}</Text>
              <View className="flex-row items-center">
                <Star size={16} color="#facc15" fill="#facc15" />
                <Text className="ml-1 font-bold text-slate-700">4.9</Text>
                <Text className="text-slate-400 ml-1">(120 Reviews)</Text>
              </View>
            </View>
          </View>

          {/* Specs Row */}
          <View className="flex-row justify-between mt-8">
            <View className="items-center bg-slate-50 p-4 rounded-3xl w-[30%]">
              <Users size={20} color="#64748b" />
              <Text className="mt-2 font-bold text-slate-900">
                {car.seats || 4} Seats
              </Text>
            </View>
            <View className="items-center bg-slate-50 p-4 rounded-3xl w-[30%]">
              <Gauge size={20} color="#64748b" />
              <Text className="mt-2 font-bold text-slate-900">
                {car.transmission || "Auto"}
              </Text>
            </View>
            <View className="items-center bg-slate-50 p-4 rounded-3xl w-[30%]">
              <Fuel size={20} color="#64748b" />
              <Text className="mt-2 font-bold text-slate-900">
                {car.fuel_type || "Petrol"}
              </Text>
            </View>
          </View>

          {/* Location & Description */}
          <View className="mt-8">
            <Text className="text-lg font-bold text-slate-900 mb-2">
              Location
            </Text>
            <View className="flex-row items-center">
              <MapPin size={18} color="#06b6d4" />
              <Text className="ml-2 text-slate-600">{car.location}</Text>
            </View>
          </View>

          <View className="mt-6 mb-24">
            <Text className="text-lg font-bold text-slate-900 mb-2">
              Description
            </Text>
            <Text className="text-slate-500 leading-6">
              {car.description ||
                "Experience luxury and comfort with this premium vehicle. Perfect for city drives or long-distance trips. Fully maintained and ready for your next adventure."}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Booking Bar */}
      <View className="absolute bottom-0 w-full bg-white border-t border-slate-100 px-6 py-5 flex-row items-center justify-between">
        <View>
          <Text className="text-slate-400 font-bold text-xs uppercase">
            Price per day
          </Text>
          <Text className="text-2xl font-extrabold text-slate-900">
            {car.price_per_day.toLocaleString()}{" "}
            <Text className="text-sm font-normal text-slate-500">MMK</Text>
          </Text>
        </View>
        <Pressable className="bg-cyan-500 px-8 py-4 rounded-2xl shadow-lg shadow-cyan-200">
          <Text className="text-white font-bold text-lg">Book Now</Text>
        </Pressable>
      </View>
    </View>
  );
}
