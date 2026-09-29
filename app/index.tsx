import { Redirect } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

export default function IndexScreen() {
  const { session, setupError, isConfigured } = useAuth();

  if ((!isConfigured || session) && !setupError) {
    return <Redirect href="/(tabs)/agenda" />;
  }

  return <Redirect href="/sign-in" />;
}
