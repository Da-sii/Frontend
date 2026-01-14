import KakaoIcon from '@/assets/icons/ic_kakao.svg';
import LoginButton from '@/components/common/buttons/LoginButton';
import { isKakaoTalkLoginAvailable, login, me } from '@react-native-kakao/user';
import { useRouter } from 'expo-router';
import { usePendingKakaoAuth } from '../../../store/usePendingKakaoAuth';
export default function KakaoLoginButton() {
  const router = useRouter();
  const setPending = usePendingKakaoAuth((s) => s.setPending);

  const onPressKakao = async () => {
    try {
      const talkAvailable = await isKakaoTalkLoginAvailable();

      const kakao = await login({
        useKakaoAccountLogin: talkAvailable ? false : true,
      });

      if (!kakao.accessToken) throw new Error('카카오 로그인에 실패했어요.');

      const user = await me();

      setPending({
        kakaoEmail: user.email,
        kakaoAccessToken: kakao.accessToken,
        kakaoRefreshToken: kakao.refreshToken ?? null,
      });

      router.replace('/oauth');
    } catch (e: any) {
      // ✅ 유저 취소 케이스: 조용히 종료
      const msg = String(e?.message ?? '');
      const code = String(e?.code ?? '');

      if (
        msg.includes('canceled by user') ||
        msg.includes('cancelled') ||
        code === 'E_CANCELLED_OPERATION'
      ) {
        return;
      }

      // ❗ 그 외는 진짜 에러
      console.error('Kakao login failed:', e);
      // Alert.alert('로그인 실패', '카카오 로그인 중 오류가 발생했어요.');
    }
  };

  return (
    <LoginButton
      label={'카카오로 로그인'}
      onPress={onPressKakao}
      color='bg-kakao'
      Icon={KakaoIcon}
      textColor='text-black'
      border='border-none'
      IconWidth={18}
      IconHeight={18}
    />
  );
}
