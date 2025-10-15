import DefaultModal from '@/components/common/modals/DefaultModal';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { compareVersions } from 'compare-versions';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';

SplashScreen.preventAutoHideAsync();

if (!__DEV__) {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    sendDefaultPii: true,
    enableLogs: true,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [Sentry.mobileReplayIntegration()],
  });
}

function RootLayout() {
  const queryClient = new QueryClient();

  const [loaded, error] = useFonts({
    NanumSquareNeo: require('@/assets/fonts/NanumSquareNeo-Variable.ttf'),
  });

  const [isUpdateRequired, setIsUpdateRequired] = useState(false);
  const [storeUrl, setStoreUrl] = useState('');

  useEffect(() => {
    const checkAppVersion = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/Da-sii/app-config/refs/heads/main/version.json',
        );
        const remoteConfig = await response.json();

        const currentVersion = Constants.expoConfig?.version;

        const platformConfig =
          Platform.OS === 'ios' ? remoteConfig.ios : remoteConfig.android;
        const minimumVersion = platformConfig.minimumVersion;

        if (compareVersions(currentVersion || '', minimumVersion) < 0) {
          setIsUpdateRequired(true);
          setStoreUrl(platformConfig.storeUrl);
        }
      } catch (e) {
        console.error('버전 체크 실패:', e);
      }
    };

    checkAppVersion();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (loaded || error) {
      await SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const handleUpdatePress = () => {
    Linking.openURL(storeUrl);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView onLayout={onLayoutRootView}>
        <BottomSheetModalProvider>
          <Stack>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            <Stack.Screen name='+not-found' />
            <Stack.Screen name='home/search' options={{ headerShown: false }} />
          </Stack>
          <StatusBar style='auto' />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>

      <DefaultModal
        visible={isUpdateRequired}
        onConfirm={handleUpdatePress}
        singleButton
        title={`“다시” 서비스가 새로워졌어요!${`\n`}업데이트하고, 더 편해진 기능을 만나보세요.`}
        confirmText='확인'
      />
    </QueryClientProvider>
  );
}

export default __DEV__ ? RootLayout : Sentry.wrap(RootLayout);
