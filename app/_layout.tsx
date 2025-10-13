import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';

if (!__DEV__) {
  Sentry.init({
    dsn: 'https://94cf4844eeacc7628b50e1af33131335@o4510182859800577.ingest.us.sentry.io/4510182861701120',
    sendDefaultPii: true,
    enableLogs: true,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [Sentry.mobileReplayIntegration()],
  });
}

function RootLayout() {
  const queryClient = new QueryClient();

  const [loaded] = useFonts({
    NanumSquareNeo: require('@/assets/fonts/NanumSquareNeo-Variable.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <Stack>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            <Stack.Screen name='+not-found' />
            <Stack.Screen name='home/search' options={{ headerShown: false }} />
          </Stack>
          <StatusBar style='auto' />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

export default __DEV__ ? RootLayout : Sentry.wrap(RootLayout);
