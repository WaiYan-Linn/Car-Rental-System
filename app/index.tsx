import { useOnboardingStore } from "@/store/onboardingStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Redirect } from "expo-router";

export default function Index() {
  const { hasSeenOnboarding } = useOnboardingStore();
  const { session } = useAuthStore();

  if (session) {
    return <Redirect href="/(protected)/(tabs)" />;
  }

  if (!hasSeenOnboarding) {
    return <Redirect href="/(onboarding)" />;
  }
}
