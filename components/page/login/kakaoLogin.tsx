import KakaoIcon from '@/assets/icons/ic_kakao.svg';
import LoginButton from '@/components/common/buttons/LoginButton';
import { isKakaoTalkLoginAvailable, login, me } from '@react-native-kakao/user';
import { useRouter } from 'expo-router';
import { usePendingKakaoAuth } from '../../../store/usePendingKakaoAuth';
export default function KakaoLoginButton() {
  const router = useRouter();
  const setPending = usePendingKakaoAuth((s) => s.setPending);

  const onPressKakao = async () => {
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
