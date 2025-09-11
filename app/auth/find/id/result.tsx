import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import Navigation from '@/components/layout/Navigation';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView, Text, View } from 'react-native';
export default function Result() {
  const router = useRouter();

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <Navigation
        left={<ArrowLeftIcon width={20} height={20} />}
        onLeftPress={() => router.back()}
      />

      <View className='p-5 flex-1'>
        <Text className='text-h-lg font-extrabold text-gray-700 mb-[12px]'>
          이미 가입한 계정이 있어요!
        </Text>
        <Text className='text-b-md font-bold text-gray-700 mb-[40px]'>
          가입하신 SNS 또는 이메일 계정을 찾았습니다.
        </Text>

        <View className='w-full bg-gray-50 rounded-[12px] px-5 py-[25px] space-y-[25px]'>
          <View className='flex-row justify-between'>
            <Text className='text-c1 font-bold text-gray-500'>가입 계정</Text>
            <Text className='text-c1 font-bold text-gray-700'>
              dki688@naver.com
            </Text>
          </View>
          <View className='flex-row justify-between'>
            <Text className='text-c1 font-bold text-gray-500'>가입 경로</Text>
            <Text className='text-c1 font-bold text-gray-700'>이메일</Text>
          </View>
          <View className='flex-row justify-between'>
            <Text className='text-c1 font-bold text-gray-500'>가입일</Text>
            <Text className='text-c1 font-bold text-gray-700'>2021.05.12</Text>
          </View>
        </View>
      </View>
      <View className='p-5'>
        <LongButton label='가입한 계정으로 로그인' onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
}
