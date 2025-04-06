import { Redirect } from 'expo-router';
import useAuth from '@/hooks/useAuth';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return null;
  }
  
  // Use type assertion to tell TypeScript this is a valid path
  return isAuthenticated ? 
    <Redirect href={'/(tabs)' as any} /> : 
    <Redirect href={'/(auth)/explore' as any} />;
}