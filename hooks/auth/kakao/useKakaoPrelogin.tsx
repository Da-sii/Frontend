import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';

const KAKAO_FLOW_KEY = 'kakao_flow';
const KAKAO_PRELOGIN_DONE_KEY = 'kakao_prelogin_done';
const KAKAO_IS_NEW_USER_KEY = 'kakao_is_new_user';

interface PreloginResponse {
  is_new_user: boolean;
}

export const useKakaoPrelogin = () => {
  // const setPending = usePendingKakaoAuth((s) => s.setPending);

  return useMutation<PreloginResponse, unknown, void>({
    // mutationFn: async () => {
    //   // ✅ 로그인 시작 표시
    //   await AsyncStorage.setItem(KAKAO_FLOW_KEY, 'in_progress');

    //   // 3) 임시 저장 (동의 후 로그인에 사용)
    //   setPending({
    //     kakaoEmail: email,
    //     kakaoAccessToken: kakao.accessToken,
    //     kakaoRefreshToken: kakao.refreshToken ?? null,
    //   });

    //   // 4) 우리 서버에 prelogin 요청
    //   return postSocialPrelogin({
    //     provider: 'kakao',
    //     email,
    //   });
    // },
    onSuccess: async (res) => {
      await AsyncStorage.setItem(KAKAO_PRELOGIN_DONE_KEY, 'true');
      await AsyncStorage.setItem(
        KAKAO_IS_NEW_USER_KEY,
        String(res.is_new_user),
      );
    },
    onError: async (err: any) => {
      await AsyncStorage.multiRemove([
        KAKAO_FLOW_KEY,
        KAKAO_PRELOGIN_DONE_KEY,
        KAKAO_IS_NEW_USER_KEY,
      ]);

      Alert.alert(
        'prelogin 실패, 다시 시도해주세요.',
        err?.message ?? '카카오 로그인 중 오류가 발생했어요.',
      );
    },
  });
};
