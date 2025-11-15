import FlashRenderer from '@/features/flash/components/FlashRenderer';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'jotai';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [queryClient, setQueryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <FlashRenderer />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  );
}
