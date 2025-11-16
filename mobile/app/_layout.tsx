import FlashRenderer from '@/features/flash/components/FlashRenderer';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'jotai';
import { useState } from 'react';
import 'react-native-reanimated';
import RoutesProvider from './RoutesProvider';


export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [queryClient, setQueryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <FlashRenderer />
          <RoutesProvider />
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  );
}
