import DefaultModal from '@/components/common/modals/DefaultModal';
import { getAccessToken } from '@/lib/authToken';
import { usePendingKakaoAuth } from '@/store/usePendingKakaoAuth';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getKeyHashAndroid,
  initializeKakaoSDK,
} from '@react-native-kakao/core';
import { unlink } from '@react-native-kakao/user';
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

function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      getKeyHashAndroid().then(console.log).catch(console.error);
    }
  }, []);

  useEffect(() => {
    initializeKakaoSDK(process.env.EXPO_PUBLIC_KAKAO_NATIVE_KEY!);
  }, []);

  //카카오 소셜로그인 약관 동의 안했을 경우 플로우
  useEffect(() => {
    (async () => {
      // 카카오 소셜가입 중 약관 동의를 안했을경우 kakao_signup
      const pending = await AsyncStorage.getItem('pendingAgreement');
      if (pending !== 'kakao_signup') return;

      // 카카오 소셜가입 중 개인정보 처리 동의를 안했을경우
      const at = await getAccessToken();
      const isLoggedIn = !!at;

      try {
        if (!isLoggedIn) {
          await unlink();
        }
      } catch (e) {
        console.log('unlink failed', e);
      } finally {
        usePendingKakaoAuth.getState().clear();
        await AsyncStorage.removeItem('pendingAgreement');
        console.log('kakao unlink success');
      }
    })();
  }, []);

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
    if (Platform.OS !== 'ios') {
      initSentry();
      return;
    }

    const timer = setTimeout(async () => {
      const { status } = await getTrackingPermissionsAsync();
      if (status === 'undetermined') {
        const res = await requestTrackingPermissionsAsync();
        if (res.status === 'granted') await initSentry();
      } else if (status === 'granted') {
        await initSentry();
      }
    }, 1500);

    return () => clearTimeout(timer);
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
                screenOptions={{
                  headerShown: false,
                  animation: 'fade',
                  animationDuration: 200,
                }}
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
