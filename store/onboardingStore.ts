import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface OnboardingState {
  hasSeenOnboarding: boolean;
  setSeen: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      setSeen: () => set({ hasSeenOnboarding: true }),
    }),
    {
      name: "onboarding-storage", // unique name for the storage key
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
