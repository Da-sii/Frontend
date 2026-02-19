import Logo from '@/assets/icons/ic_logo_start.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import { patchTermsAgreed } from '@/services/auth/terms';
import { useFocusEffect } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const Result = () => {
  const router = useRouter();
  const calledRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (calledRef.current) return;
      calledRef.current = true;

      const run = async () => {
        try {
          await patchTermsAgreed({ is_terms_agreed: true });
        } catch (e) {
          console.log('약관 동의 처리 실패', e);
        }
      };

      run();
    }, []),
  );
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <View className='items-center flex-1 mb-[58px]'>
        <Text className='mt-[75px] text-h-lg font-n-eb text-gray-700'>
          회원가입 완료
        </Text>
        <View className='items-center justify-center flex-1 w-full boer'>
          <Logo width={112} height={33} />
          <View className='flex-col items-center mt-[18px] '>
            <Text className='text-gray-900 text-b-sm font-n-rg'>
              다이어트 필수 정보,
            </Text>
            <Text className='text-gray-900 text-b-sm font-n-rg'>
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
