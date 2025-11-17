import FlashRenderer from '@/features/flash/components/FlashRenderer';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'jotai';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import AuthenticationProvider from './api/auth/AuthProvider';
import RoutesProvider from './app/RoutesProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    "Rubik-Bold": require("@/assets/fonts/Rubik-Bold.ttf"),
    "Rubik-Regular": require("@/assets/fonts/Rubik-Regular.ttf"),
    "Rubik-Medium": require("@/assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Light": require("@/assets/fonts/Rubik-Light.ttf"),
    "Rubik-ExtraBold": require("@/assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-SemiBold": require("@/assets/fonts/Rubik-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const [queryClient, setQueryClient] = useState(() => new QueryClient());

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <AuthenticationProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <FlashRenderer />
            <NavigationContainer>
              <RoutesProvider />
            </NavigationContainer>
          </ThemeProvider>
        </AuthenticationProvider>
      </Provider>
    </QueryClientProvider>
  );
}
