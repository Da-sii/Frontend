import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import DefaultModal from '@/components/common/modals/DefaultModal';
import Navigation from '@/components/layout/Navigation';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
export default function Index() {
  const router = useRouter();
  const { open } = useLocalSearchParams<{ open?: string }>();
  const openedRef = useRef(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open === 'fail' && !openedRef.current) {
      openedRef.current = true;
      setTimeout(() => {
        setVisible(true); // 혹은 bottomSheetRef.current?.present();
      }, 200); // 0.1초 정도 지연
    }
  }, [open]);

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <Navigation
        left={<ArrowLeftIcon width={20} height={20} />}
        onLeftPress={() => router.back()}
      />

      <View className='p-5'>
        <Text className='text-h-lg font-extrabold text-gray-700 mb-[12px]'>
          계정 찾기
        </Text>
        <Text className='text-b-md font-bold text-gray-700 mb-[40px]'>
          휴대폰 본인인증이 필요합니다.
        </Text>
        <LongButton
          label='휴대폰 본인인증'
          onPress={() => {
            router.push('/auth/phone?menu=findId');
          }}
        />
      </View>
      <DefaultModal
        visible={visible}
        onConfirm={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        title='계정을 찾을 수 없습니다.'
        message='해당 정보로 가입된 계정을 찾을 수 없습니다.'
        secondMessage='다시 한번 확인해주시거나, 회원가입을 진행해 주세요'
        confirmText='회원가입'
        cancelText='닫기'
      />
    </SafeAreaView>
  );
}
