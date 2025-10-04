import AppleIcon from '@/assets/icons/ic_apple.svg';
import EmailIcon from '@/assets/icons/ic_email.svg';
import Logo from '@/assets/icons/ic_logo_start.svg';
import LoginButton from '@/components/common/buttons/LoginButton';
import { Stack, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import KakaoLogin from '@/components/page/login/kakaoLogin';
import { useEffect, useState } from 'react';
import KakaoLoginWebView from '@/components/page/login/KakaoLoginWebView';
import { useKakaoLogin } from '@/hooks/useKakaoLogin';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Index() {
  const router = useRouter();
  const [showKakao, setShowKakao] = useState(false);
  const [forceReauth, setForceReauth] = useState(false);
  const kakaoLogin = useKakaoLogin();

  useEffect(() => {
    // 로그아웃 후 첫 로그인 여부 확인
    AsyncStorage.getItem('forceReauth').then((value) => {
      if (value === 'true') {
        setForceReauth(true);
        AsyncStorage.removeItem('forceReauth'); // 한 번 쓰면 바로 삭제
      }
    });
  }, []);

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <View className='flex-1 items-center'>
        <View className='items-center w-full justify-center h-[64.98%]'>
          <Logo width={112} height={33} />
          <View className='flex-col items-center mt-[18px] '>
            <Text className='text-b-sm font-regular text-gray-900'>
              다이어트 필수 정보,
            </Text>
            <Text className='text-b-sm font-regular text-gray-900'>
              보조제 성분부터 후기까지 한번에
            </Text>
          </View>
        </View>

        <View className=' w-full px-5 flex-col space-y-3'>
          <KakaoLogin onPress={() => setShowKakao(true)} />
          <LoginButton
            label='Apple로 로그인'
            onPress={() => {}}
            color='bg-[#000]'
            Icon={AppleIcon}
            textColor='text-white'
            border='border-none'
            IconWidth={46}
            IconHeight={46}
          />
          <LoginButton
            label='이메일로 로그인'
            onPress={() => {
              router.push('/auth/login/email');
            }}
            color='bg-[#FFF]'
            Icon={EmailIcon}
            borderColor='border-gray-200'
            textColor='text-black'
            border='border'
            IconWidth={18}
            IconHeight={18}
          />
        </View>

        <View className='flex-row items-center justify-center mt-[10px]'>
          <Text className='text-b-sm font-bold text-gray-500'>
            서비스가 궁금하시다면?
          </Text>
          <Pressable
            onPress={() => {
              router.push('/home');
            }}
          >
            <Text className='text-b-md font-extrabold text-[#19B375] ml-1'>
              둘러보기
            </Text>
          </Pressable>
        </View>
      </View>

      {/* KakaoLoginWebView 모달 */}
      {showKakao && (
        <KakaoLoginWebView
          visible={showKakao}
          onClose={() => setShowKakao(false)}
          onAuthCode={kakaoLogin.mutate}
          forceReauth={forceReauth} 
        />
      )}
    </SafeAreaView>
  );
}
