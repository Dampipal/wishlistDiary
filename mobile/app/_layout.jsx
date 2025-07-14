import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SafeArea from '../components/SafeAreaWrapper';
import SplashScreen from '../components/SplashScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false); // Ready only after logic

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      const inAuthGroup = segments[0] === '(auth)';

      if (!token && !inAuthGroup) {
        router.replace('/(auth)/onboarding');
      }

      if (token && inAuthGroup) {
        router.replace('/(tabs)');
      }

      // Wait for both auth logic + min splash time
      setTimeout(() => {
        setIsReady(true);
      }, 800); // faster splash, optional
    };

    checkAuth();
  }, [segments, router]);

  if (!isReady) return <SplashScreen />;

  return (
    <SafeAreaProvider>
      <SafeArea>
        <Slot />
      </SafeArea>
    </SafeAreaProvider>
  );
}
