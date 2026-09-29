import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  setupError: string | null;

  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setConfigured: (configured: boolean) => void;
  setSetupError: (error: string | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isLoading: true,
  isConfigured: true,
  setupError: null,

  setSession: (session) => set({ session }),
  setLoading: (isLoading) => set({ isLoading }),
  setConfigured: (isConfigured) => set({ isConfigured }),
  setSetupError: (setupError) => set({ setupError }),
  reset: () => set({
    session: null,
    isLoading: false,
    isConfigured: true,
    setupError: null,
  }),
}));
