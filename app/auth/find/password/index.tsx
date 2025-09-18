import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import { TextField } from '@/components/common/Inputs/TextField';
import Navigation from '@/components/layout/Navigation';
import { isEmail } from '@/utils/validation';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { useSignupDraft } from '@/store/useSignupDraft';
export default function Index() {
  const router = useRouter();

  const [isEmailValid, setIsEmailValid] = useState(false);
  const { email, setEmail } = useSignupDraft();
  // 이메일 형식 체크
  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  useEffect(() => {
    if (!validateEmail(email)) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }
  }, [email]);

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <Navigation
        left={<ArrowLeftIcon width={20} height={20} />}
        onLeftPress={() => router.back()}
      />

      <View className='p-5'>
        <Text className='text-h-lg font-extrabold text-gray-700 mb-[12px]'>
          비밀번호 변경
        </Text>
        <Text className='text-b-md font-bold text-gray-700 mb-[8px]'>
          가입하신 이메일을 입력해주세요.
        </Text>
        <Text className='text-b-md font-bold text-gray-700 mb-[25px]'>
          휴대폰 인증을 통해 비밀번호를 변경할 수 있습니다.
        </Text>

        <View className='mb-[30px]'>
          <TextField
            menu={2}
            value={email}
            onChangeText={setEmail}
            placeholder='이메일 (abc@dasii.com)'
            firstMessage='이메일 형식'
            validateFirst={isEmail}
          />
        </View>
        <View className='mb-[25px]'>
          <LongButton
            label='휴대폰 본인인증'
            onPress={() => {
              router.push('/auth/phone');
            }}
            disabled={email.length === 0}
          />
        </View>
        <View className='flex-row items-center justify-center mt-[10px]'>
          <Text className='text-b-sm font-bold text-gray-500'>
            이메일을 잊으셨나요?
          </Text>
          <Pressable
            onPress={() => {
              router.push('/auth/find/id');
            }}
          >
            <Text className='text-b-md font-extrabold text-[#19B375] ml-1'>
              계정 찾기
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
