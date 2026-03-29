import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePushNotifications } from "@/hooks/usePushNotifications"; // 👈 Added
import { useOnboardingStore } from "@/store/onboardingStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore"; // 👈 Added
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications"; // 👈 Added
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient();

export const unstable_settings = {
  anchor: "(protected)/(tabs)",
};

// 1. 👈 GLOBAL DEFAULT HANDLER (Outside the component)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { initialize, isLoading, session, getIsProfileIncomplete } =
    useAuthStore();
  const { subscribeToMessages } = useChatStore(); // 👈 Added
  const { registerForPushNotificationsAsync } = usePushNotifications(); // 👈 Added

  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const { hasSeenOnboarding } = useOnboardingStore();

  const [isMounted, setIsMounted] = useState(false);

  // 2. Initialize Auth
  useEffect(() => {
    setIsMounted(true);
    initialize();
  }, []);

  // 3. 👈 NEW: PUSH REGISTRATION & REALTIME
  useEffect(() => {
    if (!isMounted || isLoading || !session?.user) return;

    // Get the Push Token for this user
    registerForPushNotificationsAsync();

    // Start the global realtime listener
    const unsubscribe = subscribeToMessages(session.user.id);
    return () => unsubscribe();
  }, [session?.user?.id, isMounted, isLoading]);

  // 4. 👈 NEW: DYNAMIC BANNER SUPPRESSION
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        // Match your segment structure (protected)/(tabs)/messages or chat
        const isMessagesFeature =
          segments.includes("messages") || segments.includes("chat");
        const activeChatId =
          segments.length > 0 ? segments[segments.length - 1] : null;
        const senderId = notification.request.content.data?.senderId;

        const isChattingWithSender =
          isMessagesFeature && activeChatId === senderId;

        return {
          shouldShowAlert: !isChattingWithSender,
          shouldPlaySound: !isChattingWithSender,
          shouldSetBadge: true,
        };
      },
    });
  }, [segments]);

  // 5. THE GUARD LOGIC (Maintained from your fixed version)
  useEffect(() => {
    if (!isMounted || isLoading || !rootNavigationState?.key) return;

    const inAuthGroup = segments[0] === "auth";
    const inOnboardingGroup = segments[0] === "(onboarding)";
    const isProfileIncomplete = getIsProfileIncomplete();
    const currentPath = segments.join("/");

    const timeoutId = setTimeout(() => {
      // CASE: Not logged in
      if (!session) {
        if (!inAuthGroup && !inOnboardingGroup) {
          router.replace("/auth/login");
        }
        return;
      }

      // CASE: Profile Incomplete
      if (isProfileIncomplete) {
        if (currentPath !== "auth/complete-profile") {
          router.replace("/auth/complete-profile");
        }
        return;
      }

      // CASE: Fully logged in
      const isAtRoot = segments.length === 0 || segments[0] === "index";
      if (inAuthGroup || isAtRoot) {
        if (currentPath !== "(protected)/(tabs)") {
          router.replace("/(protected)/(tabs)");
        }
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [session, isLoading, segments, rootNavigationState?.key, isMounted]);

  if (isLoading || !isMounted) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8f9fa",
        }}
      >
        <ActivityIndicator size="large" color="#16a8e3" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <GluestackUIProvider mode="light">
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen
                name="(onboarding)"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(protected)"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </GluestackUIProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
