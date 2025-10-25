import { Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '@/assets/icons/ic_logo_start.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import { useRouter } from 'expo-router';
const Result = () => {
  const router = useRouter();
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <View className='items-center flex-1 mb-[58px]'>
        <Text className='mt-[75px] text-h-lg font-extrabold text-gray-700'>
          회원가입 완료
        </Text>
        <View className='items-center w-full justify-center boer flex-1'>
          <Logo width={112} height={33} />
          <View className='flex-col items-center mt-[18px] '>
            <Text className='text-b-sm font-regular text-gray-900'>
              다이어트 필수 정보,
            </Text>
            <Text className='text-b-sm font-regular text-gray-900'>
              보조제 성분부터 후기까지 한번에
            </Text>
          </View>
        </View>
      </View>
      <View className='px-4 mb-[11px]'>
        <LongButton
          label='시작하기'
          onPress={() => {
            router.replace('/auth/login/email');
          }}
          height='h-[60px]'
        />
      </View>
    </SafeAreaView>
  );
};

export default Result;
