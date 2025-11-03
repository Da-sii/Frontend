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
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency';

import { useCallback, useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';

// Splash 화면 자동 숨김 방지 (1회)
SplashScreen.preventAutoHideAsync().catch(() => {});

// React Query 클라이언트는 1회 생성
const queryClient = new QueryClient();

async function initSentry() {
  if (__DEV__) return;
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    sendDefaultPii: true,
    enableLogs: true,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [Sentry.mobileReplayIntegration()],
  });
}

// 프로덕션에서만 Sentry 활성화
// if (!__DEV__) {
//   Sentry.init({
//     dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
//     sendDefaultPii: true,
//     enableLogs: true,
//     replaysSessionSampleRate: 0.1,
//     replaysOnErrorSampleRate: 1,
//     integrations: [Sentry.mobileReplayIntegration()],
//   });
// }

function RootLayout() {
  const [loaded, error] = useFonts({
    // 1. 기존 가변 폰트 항목을 삭제하거나 주석 처리합니다.
    NanumSquareNeo: require('@/assets/fonts/NanumSquareNeo-Variable.ttf'),

    // 2. 굵기별 정적 폰트 파일을 개별적으로 로드합니다.

    // Light (300) - NanumSquareNeo-aLt.ttf
    'NanumSquareNeo-Light': require('@/assets/fonts/NanumSquareNeo-aLt.ttf'),

    // Regular (400) - NanumSquareNeo-bRg.ttf
    'NanumSquareNeo-Regular': require('@/assets/fonts/NanumSquareNeo-bRg.ttf'),

    // Bold (700) - NanumSquareNeo-cBd.ttf
    'NanumSquareNeo-Bold': require('@/assets/fonts/NanumSquareNeo-cBd.ttf'),

    // ExtraBold (800) - NanumSquareNeo-dEb.ttf
    'NanumSquareNeo-ExtraBold': require('@/assets/fonts/NanumSquareNeo-dEb.ttf'),
  });

  const [isUpdateRequired, setIsUpdateRequired] = useState(false);
  const [storeUrl, setStoreUrl] = useState('');
  const [rootMounted, setRootMounted] = useState(false);

  // 루트가 실제로 그려졌는지 플래그
  const onLayoutRootView = useCallback(() => {
    setRootMounted(true);
  }, []);

  // 루트가 렌더됨 + 폰트가 로드(or 에러) 되었을 때 스플래시 숨김
  useEffect(() => {
    if (rootMounted && (loaded || error)) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [rootMounted, loaded, error]);

  // 앱 최소 버전 체크
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

  // 앱 추적 허용/거부 요청
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'ios') {
        // iOS 외 플랫폼은 바로 초기화(추적 개념 X)
        await initSentry();
        return;
      }

      const { status } = await getTrackingPermissionsAsync();
      if (status === 'undetermined') {
        const res = await requestTrackingPermissionsAsync();
        if (res.status === 'granted') await initSentry();
      } else if (status === 'granted') {
        await initSentry();
      }
    })();
  }, []);

  const handleUpdatePress = () => {
    if (storeUrl) Linking.openURL(storeUrl);
  };
  useEffect(() => {
    const t = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView onLayout={onLayoutRootView} style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          {loaded || error ? (
            <>
              <Stack
                initialRouteName='index'
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen
                  name='home/search'
                  options={{ headerShown: false }}
                />
                <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                <Stack.Screen name='+not-found' />
              </Stack>
              <StatusBar style='auto' />
            </>
          ) : null}
        </BottomSheetModalProvider>

        <DefaultModal
          visible={isUpdateRequired}
          onConfirm={handleUpdatePress}
          singleButton
          title={`“다시” 서비스가 새로워졌어요!\n업데이트하고, 더 편해진 기능을 만나보세요.`}
          confirmText='확인'
        />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

export default __DEV__ ? RootLayout : Sentry.wrap(RootLayout);
