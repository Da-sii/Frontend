import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import { TextField } from '@/components/common/Inputs/TextField';
import Navigation from '@/components/layout/Navigation';
import {
  hasPasswordComposition,
  isEmail,
  isLen8to20,
  isSamePassword,
} from '@/utils/validation';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
export default function Index() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <Navigation
        left={<ArrowLeftIcon width={20} height={20} />}
        onLeftPress={() => router.back()}
      />

      <View className='p-5'>
        <Text className='text-h-lg font-extrabold text-gray-700 mb-[12px]'>
          회원가입
        </Text>
        <Text className='text-b-md font-bold text-gray-700 mb-[8px]'>
          계정 생성 후,
        </Text>
        <Text className='text-b-md font-bold text-gray-700 mb-[25px]'>
          휴대폰 본인인증을 완료하면 가입이 완료됩니다.
        </Text>

        <View className='space-y-[18px] mb-[25px]'>
          <View>
            <TextField
              menu={1}
              value={email}
              onChangeText={setEmail}
              placeholder='이메일을 입력해주세요.'
              firstMessage='이메일 형식'
              validateFirst={isEmail}
            />
          </View>
          <View>
            <TextField
              menu={1}
              value={password}
              onChangeText={setPassword}
              placeholder='비밀번호를 입력해주세요..'
              firstMessage='8-20자 이내'
              secondMessage='영문, 숫자, 특수문자 포함'
              validateFirst={isLen8to20}
              validateSecond={hasPasswordComposition}
              secureTextEntry={true}
            />
          </View>
          <View>
            <TextField
              menu={1}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder='비밀번호를 입력해주세요..'
              firstMessage='비밀번호 일치'
              validateFirst={(t) => isSamePassword(password, t)}
              secureTextEntry={true}
            />
          </View>
        </View>

        <LongButton
          label='휴대폰 본인인증'
          onPress={() => {}}
          disabled={email.length === 0 || password.length === 0}
        />
      </View>
    </SafeAreaView>
  );
}
