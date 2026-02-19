// app/oauth.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { useKakaoLogin } from '@/hooks/auth/kakao/useKakaoLogin';
import { postSocialPrelogin } from '../services/auth/prelogin';
import { usePendingKakaoAuth } from '../store/usePendingKakaoAuth';

export default function OAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const { kakaoAccessToken, kakaoEmail, clear } = usePendingKakaoAuth();
  const { mutate: finalizeLogin } = useKakaoLogin();

  const didRunRef = useRef(false);

  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    (async () => {
      try {
        // ✅ 카카오 토큰이 없는데 oauth에 들어오면 잘못된 진입
        if (!kakaoAccessToken) {
          router.replace('/auth/login');
          return;
        }

        // ✅ 신규/기존 여부 확인(서버 로깅/사전 처리 목적)
        await postSocialPrelogin({
          provider: 'kakao',
          email: kakaoEmail,
        });

        // ✅ 카카오 로그인/회원가입 최종 처리
        finalizeLogin(undefined, {
          onSuccess: async () => {
            try {
              clear();
              await AsyncStorage.multiRemove([
                'kakao_flow',
                'kakao_prelogin_done',
                'kakao_is_new_user',
              ]);

              // ✅ 완료되면 home
              router.replace('/home');
            } catch (e) {
              console.log('kakao cleanup error:', e);
              router.replace('/auth/login');
            }
          },
          onError: (err: unknown) => {
            console.log('finalizeLogin error:', err);
            router.replace('/auth/login');
          },
        });
      } catch (e) {
        console.log('oauth error:', e);
        router.replace('/auth/login');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [kakaoAccessToken, kakaoEmail, finalizeLogin, clear, router]);

  if (isLoading) {
    return (
      <View className='items-center justify-center flex-1'>
        <Stack.Screen options={{ headerShown: false }} />
        <Text></Text>
      </View>
    );
  }

  // 렌더 UI 없음(라우팅 전용)
  return (
    <View className='items-center justify-center flex-1'>
      <Stack.Screen options={{ headerShown: false }} />
      <Text></Text>
    </View>
  );
}
