// hooks/useKakaoLogin.ts
import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';
import {
  signInWithKakao,
  KakaoSignInResponse,
} from '../services/auth/signInWithKakao';
import { setTokens } from '../lib/authToken';
import { useRouter } from 'expo-router';

export const useKakaoLogin = () => {
  const router = useRouter();
  return useMutation<KakaoSignInResponse, unknown, string>({
    mutationFn: async (code: string) => {
      const res = await signInWithKakao(code);
      return res;
    },
    onSuccess: async (data) => {
      await setTokens(data.access, data.refresh);
      router.replace('/home');
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        '로그인 중 오류가 발생했어요.';
      Alert.alert('로그인 실패', msg);
    },
  });
};

// import * as Linking from 'expo-linking';
// import { useEffect } from 'react';
// import * as SecureStore from 'expo-secure-store';
// export function useKakaoLogin() {
//   useEffect(() => {
//     const sub = Linking.addEventListener('url', async ({ url }) => {
//       const code = new URL(url).searchParams.get('code');
//       if (!code) return;

//       try {
//         const res = await fetch('http://<서버주소>:8000/auth/kakao/token/', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ code }),
//         });
//         const json = await res.json();
//         console.log('토큰:', json.access, json.refresh);

//         // ✅ SecureStore 등에 저장
//         await SecureStore.setItemAsync('access', json.access);
//         await SecureStore.setItemAsync('refresh', json.refresh);
//       } catch (err) {
//         console.error('토큰 요청 실패:', err);
//       }
//     });

//     return () => sub.remove();
//   }, []);
// }
