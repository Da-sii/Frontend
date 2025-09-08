import LogoIcon from '@/assets/icons/ic_logo_full.svg';
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import appleAuth from '@invertase/react-native-apple-authentication';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

async function handleSignInApple() {
  try {
    // Apple 로그인 요청 수행
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    // 사용자 인증 상태 확인
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    // 인증 상태 확인 후 처리
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // 사용자가 인증됨
      console.log('Apple 로그인 성공:', appleAuthRequestResponse);
      // 여기서 서버에 로그인 데이터 전송 등 추가 처리
    }
  } catch (error) {
    console.error('Apple 로그인 오류:', error);
  }
}

async function handleSignInKakao() {
  console.log('카카오 로그인 실행');
}

async function handleSignInEmail() {
  console.log('이메일 로그인 실행');
}

export default function Login() {
  const router = useRouter();

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen
        options={{
          headerTitle: '로그인',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name='chevron-back' size={24} color='#333' />
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />
      {/* 로고 & 타이틀 */}
      <View className='flex-1 items-center justify-center'>
        {/* 로고 (이미지로 대체 가능) */}
        <View className='mb-3'>
          {/* 예시 svg/이미지 - 실제 svg/이미지 컴포넌트로 교체하세요 */}
          <LogoIcon />
        </View>

        <Text className='text-center text-gray-800 text-base mt-1 leading-relaxed'>
          다이어트 필수 정보,{'\n'}
          보조제 성분부터 후기까지 한 번에
        </Text>
      </View>

      {/* 버튼들 */}
      <View className='w-full pb-10 px-6'>
        {/* 카카오 로그인 */}
        <Pressable
          className='flex-row items-center justify-center bg-[#FEE500] rounded-xl h-14 mb-3'
          style={{ elevation: 1 }}
        >
          <FontAwesome
            name='comment'
            size={20}
            color='#3C1E1E'
            className='mr-2'
            style={{ marginRight: 8 }}
          />
          <Text
            className='text-base font-semibold'
            style={{ color: '#3C1E1E' }}
          >
            카카오로 로그인
          </Text>
        </Pressable>
        {/* Apple 로그인 */}
        <Pressable
          onPress={handleSignInApple}
          className='flex-row items-center justify-center bg-black rounded-2xl h-14 mb-3'
        >
          <Ionicons name='logo-apple' size={22} color='white' />
          <Text className='ml-2 text-base font-semibold text-white'>
            Apple로 로그인
          </Text>
        </Pressable>
        {/* 이메일 로그인 */}
        <Pressable className='flex-row items-center justify-center border border-gray-200 rounded-xl h-14 mb-6 bg-white'>
          <MaterialCommunityIcons
            name='email-outline'
            size={20}
            color='#333'
            className='mr-2'
            style={{ marginRight: 8 }}
          />
          <Text className='text-base font-semibold text-gray-700'>
            이메일로 로그인
          </Text>
        </Pressable>
        {/* 서비스 소개 */}
        <View className='flex-row items-center justify-center'>
          <Text className='text-gray-400 text-xs'>서비스가 궁금하시다면? </Text>
          <Pressable>
            <Text className='text-green-500 text-xs font-semibold'>
              둘러보기
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
