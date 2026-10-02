import { signIn, SignInRequest, SignInResponse } from '@/services/auth/signIn';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { setTokens } from '../lib/authToken';
import { identifyAmplitudeUser, trackLoginSucceeded } from '../lib/amplitude';

export const useSignin = () => {
  const router = useRouter();

  return useMutation<SignInResponse, unknown, SignInRequest>({
    mutationFn: signIn,
    onSuccess: async (data) => {
      await setTokens(data.access);
      void identifyAmplitudeUser(String(data.user.id))
        .then(() => trackLoginSucceeded('email'))
        .catch((error) => {
          if (__DEV__)
            console.warn('[Amplitude] 로그인 이벤트 전송 실패', error);
        });
      router.replace('/home');
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        '로그인 중 오류가 발생했어요.';
    },
  });
};
