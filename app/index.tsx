import { useOnboardingStore } from "@/store/onboardingStore";
import { Redirect } from "expo-router";

export default function Index() {
  const { hasSeenOnboarding } = useOnboardingStore();

  if (!hasSeenOnboarding) {
    return <Redirect href="/(onboarding)" />;
  }

  return <Redirect href="/(tabs)" />;
}
