import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import { TextField } from '@/components/common/Inputs/TextField';
import Navigation from '@/components/layout/Navigation';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
export default function Index() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <Navigation
        left={<ArrowLeftIcon width={20} height={20} />}
        onLeftPress={() => router.back()}
      />

      <View className='p-5'>
        <Text className='text-h-lg font-extrabold text-gray-700 mb-[12px]'>
          회원 가입
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
              value={email}
              onChangeText={setEmail}
              placeholder='이메일을 입력해주세요.'
            />
          </View>
          <View>
            <TextField
              value={email}
              onChangeText={setEmail}
              placeholder='비밀번호를 입력해주세요.'
              secureTextEntry={true}
            />
          </View>
          <View>
            <TextField
              value={email}
              onChangeText={setEmail}
              placeholder='비밀번호를 다시 입력해주세요.'
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
