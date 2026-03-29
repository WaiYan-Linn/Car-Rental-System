import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { supabase } from "../lib/supabase";

interface AuthState {
  session: Session | null;
  user: User | null;
  role: string | null;
  profile: any | null;
  isLoading: boolean;
  isVerifying: boolean;
  setIsVerifying: (value: boolean) => void;
  getIsProfileIncomplete: () => boolean;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  role: null,
  isLoading: true,
  isVerifying: false,

  setIsVerifying: (value: boolean) => set({ isVerifying: value }),

  // Logic to check if user needs to fill more info
  getIsProfileIncomplete: () => {
    const { profile, session } = get();
    // If no session, they aren't logged in (not incomplete)
    if (!session) return false;
    // If we have a session but NO profile row yet, consider it incomplete
    if (!profile || Object.keys(profile).length === 0) return true;
    // Check mandatory fields
    return !profile.nrc || !profile.postal_code;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, role: null, profile: null });
  },

  initialize: async () => {
    set({ isLoading: true });

    // 1. Get current session immediately
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // 2. Fetch profile synchronously to prevent "Gate-Skipping"
    let initialProfile = null;
    if (session?.user) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      initialProfile = data;
    }

    set({
      session,
      user: session?.user ?? null,
      profile: initialProfile,
      role: initialProfile?.role || null,
      isLoading: false,
    });

    // 3. Start the background listener
    supabase.auth.onAuthStateChange(async (event, session) => {
      // Ignore events during OTP to prevent race conditions
      if (get().isVerifying) return;

      if (event === "SIGNED_OUT") {
        set({ session: null, user: null, role: null, profile: null });
        return;
      }

      set({ session, user: session?.user ?? null });

      if (session?.user) {
        // Use the senior's "setTimeout" trick to avoid deadlock during token refresh
        setTimeout(async () => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          set({
            role: profile?.role || null,
            profile: profile || {},
          });
        }, 0);
      }
    });
  },
}));
