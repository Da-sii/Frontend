import Logo from '@/assets/icons/ic_logo_full.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Completion() {
  const router = useRouter();
  const { action } = useLocalSearchParams<{ action?: string }>();

  const isWithdraw = action === 'withdraw';

  const title = isWithdraw ? '회원 탈퇴 완료' : '비밀번호 변경 완료';
  const subText = '다이어트 필수 정보,\n보조제 성분부터 후기까지 한번에';

  const buttonText = isWithdraw ? '처음 화면으로' : '바로 로그인';

  const handleButton = () => {
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView className='flex-1 bg-white px-4'>
      <Stack.Screen options={{ headerShown: false }} />

      <View className='flex-1 flex-col justify-between items-center pt-20 pb-3'>
        <Text className='text-[24px] font-bold text-gray-800 mb-6'>
          {title}
        </Text>

        <View className='items-center'>
          <Text className='text-[36px] font-bold text-green-500 mb-3'>
            <Logo />
          </Text>
          <Text className='mt-1 text-center font-semibold text-[14px] text-gray-500 leading-5'>
            {subText}
          </Text>
        </View>

        <LongButton label={buttonText} onPress={handleButton} />
      </View>
    </SafeAreaView>
  );
}
