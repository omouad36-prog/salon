import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const session = useAuthStore((s) => s.session);
  const isLoading = useAuthStore((s) => s.isLoading);
  const setupError = useAuthStore((s) => s.setupError);
  const isConfigured = useAuthStore((s) => s.isConfigured);

  async function signIn(email: string, password: string) {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase n’est pas configure.') };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }

  async function signOut() {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  }

  return {
    session,
    isLoading,
    isConfigured,
    setupError,
    isAuthenticated: !!session,
    signIn,
    signOut,
  };
}
