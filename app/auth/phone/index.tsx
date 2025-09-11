import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import Navigation from '@/components/layout/Navigation';
import { Stack, useRouter } from 'expo-router';
import { Pressable, SafeAreaView, Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <Navigation
        left={<ArrowLeftIcon width={20} height={20} />}
        onLeftPress={() => router.back()}
      />

      <View className='p-5'>
        <Text className='text-h-lg font-extrabold text-gray-700 mb-[12px]'>
          이용중인 통신사
        </Text>

        <Pressable
          onPress={() => {
            console.log('SKT');
          }}
        >
          <Text>SKT</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            console.log('KT');
          }}
        >
          <Text>KT</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            console.log('LG U+');
          }}
        >
          <Text>LG U+</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            console.log('SKT 알뜰폰');
          }}
        >
          <Text>SKT 알뜰폰</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            console.log('KT 알뜰폰');
          }}
        >
          <Text>KT 알뜰폰</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            console.log('LG U+ 알뜰폰');
          }}
        >
          <Text>LG U+ 알뜰폰</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            router.push('/auth/find/id/result');
          }}
        >
          <Text>계정 찾기 성공</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            router.push({
              pathname: '/auth/find/id',
              params: { open: 'fail' },
            });
          }}
        >
          <Text>계정 찾기 실패</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
