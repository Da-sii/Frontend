import LoginButton from '@/components/common/buttons/LoginButton';
import KakaoIcon from '@/assets/icons/ic_kakao.svg';

type Props = {
  onPress: () => void;
};
export default function LoginScreen({ onPress }: Props) {
  return (
    <LoginButton
      label={'카카오로 로그인'}
      onPress={onPress}
      color='bg-kakao'
      Icon={KakaoIcon}
      textColor='text-black'
      border='border-none'
      IconWidth={18}
      IconHeight={18}
    />
  );
}
