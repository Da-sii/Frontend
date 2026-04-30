import { LongButton } from '@/components/common/buttons/LongButton';
import { router, Stack } from 'expo-router';
import { View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className='flex-1 items-center justify-center px-6'>
        <LongButton
          label='메인 페이지로 이동하기'
          onPress={() => router.replace('/(tabs)/home')}
        />
      </View>
    </>
  );
}
