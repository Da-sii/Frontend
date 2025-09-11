import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import { TextField } from '@/components/common/Inputs/TextField';
import Navigation from '@/components/layout/Navigation';
import { isEmail } from '@/utils/validation';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
export default function Email() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  // 이메일 형식 체크
  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleLogin = () => {
    if (!validateEmail(email)) {
      setIsEmailValid(true); // 잘못된 경우 false
      return;
    } else {
      setIsEmailValid(false);
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <Navigation
        left={<ArrowLeftIcon width={20} height={20} />}
        onLeftPress={() => router.back()}
      />

      <View className='p-5'>
        <Text className='text-h-lg font-extrabold text-gray-700 mb-[25px]'>
          이메일로 계속
        </Text>
        <View className='space-y-3 mb-[25px]'>
          <View>
            <TextField
              menu={2}
              value={email}
              onChangeText={setEmail}
              placeholder='이메일'
              firstMessage='이메일 형식'
              validateFirst={isEmail}
            />
          </View>
          <View>
            <TextField
              value={password}
              onChangeText={setPassword}
              placeholder='비밀번호 (8-20자, 영문+숫자+특수문자)'
              secureTextEntry={true}
            />
          </View>
        </View>
        <LongButton
          label='로그인'
          onPress={handleLogin}
          disabled={email.length === 0 || password.length === 0}
        />

        <View className='items-center'>
          <View className='mt-[25px] flex-row justify-between  w-[265px]'>
            <Pressable onPress={() => router.push('/auth/find/id')}>
              <Text className='text-b-sm font-regular text-gray-500'>
                계정 찾기
              </Text>
            </Pressable>
            <Pressable onPress={() => router.push('/auth/find/password')}>
              <Text className='text-b-sm font-regular text-gray-500 border-x-[2px] px-[15px] border-gray-300 '>
                비밀번호 변경
              </Text>
            </Pressable>
            <Pressable onPress={() => router.push('/auth/signUp')}>
              <Text className='text-b-sm font-regular text-gray-500'>
                회원가입
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
