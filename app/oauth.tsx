// app/oauth.tsx

import CircleCheckGrayIcon from '@/assets/icons/auth/ic_circle_check_gray.svg';
import CircleCheckGreenIcon from '@/assets/icons/auth/ic_circle_check_green.svg';
import RightArrowIcon from '@/assets/icons/ic_arrow_right.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import { HomeFooterModal } from '@/components/page/home/HomeFooterModal';
import { useKakaoLogin } from '@/hooks/auth/kakao/useKakaoLogin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { postSocialPrelogin } from '../services/auth/prelogin';
import { usePendingKakaoAuth } from '../store/usePendingKakaoAuth';

const TERMS: { id: string; terms: string; essential: boolean }[] = [
  { id: 'service', terms: '이용 약관 동의', essential: true },
  { id: 'privacy', terms: '개인정보 수집/이용 동의', essential: true },
  { id: 'age', terms: '연령 제한 및 법적 규정 동의', essential: true },
  { id: 'appUsage', terms: '앱 이용 정보 수집 동의', essential: true },
  { id: 'notification', terms: '알림 및 푸시 알림 동의', essential: false },
];
const ESSENTIAL_IDXS = TERMS.map((t, i) => (t.essential ? i : -1)).filter(
  (i) => i !== -1,
);
export default function OAuth() {
  const router = useRouter();
  const [checkedSet, setCheckedSet] = useState<Set<number>>(new Set());
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { kakaoAccessToken, kakaoRefreshToken, kakaoEmail, clear } =
    usePendingKakaoAuth();
  const { mutate: finalizeLogin } = useKakaoLogin();

  const goFinalizeLogin = () => {
    finalizeLogin(undefined, {
      onSuccess: async () => {
        clear();
        await AsyncStorage.multiRemove([
          'kakao_flow',
          'kakao_prelogin_done',
          'kakao_is_new_user',
        ]);
        router.replace('/home');
      },
      onError: (err: any) => {
        console.log('finalizeLogin error:', err);
        router.replace('/auth/login');
      },
    });
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!kakaoAccessToken) return;

      try {
        const res = await postSocialPrelogin({
          provider: 'kakao',
          email: kakaoEmail,
        });

        if (cancelled) return;

        if (res.is_new_user) {
          setIsLoading(false); // ✅ 신규 유저만 약관 UI 노출
          return;
        }

        goFinalizeLogin(); // ✅ 기존 유저면 자동 로그인
      } catch (e) {
        console.log('oauth effect error:', e);
        // 실패 시에는 로그인 화면으로 보내는 게 UX 좋음
        router.replace('/auth/login');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [kakaoAccessToken, kakaoRefreshToken, kakaoEmail]);

  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text></Text>
      </View>
    );
  }

  // 전체 선택 여부 / 필수 항목 모두 선택 여부
  const isAllChecked = checkedSet.size === TERMS.length;

  const isEssentialChecked = ESSENTIAL_IDXS.every((i) => checkedSet.has(i));

  // 전체 토글
  const toggleAll = () => {
    setCheckedSet((prev) =>
      prev.size === TERMS.length ? new Set() : new Set(TERMS.map((_, i) => i)),
    );
  };

  // 개별 토글
  const toggleItem = (idx: number) => {
    setCheckedSet((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const onPressSubmit = async () => {
    await AsyncStorage.removeItem('pendingAgreement');
    goFinalizeLogin();
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <View>
        {/* <Text>oauth 페이지 입니다</Text>
      <Text>kakaoAccessToken : {kakaoAccessToken}</Text>
      <Text>kakaoRefreshToken : {kakaoRefreshToken}</Text>
      <Text>kakaoEmail : {kakaoEmail}</Text> */}

        <View className='px-5 pt-[30px] pb-[45px]'>
          <Pressable
            onPress={toggleAll}
            className='flex-row items-center mb-[28px] '
            hitSlop={8}
          >
            {isAllChecked ? (
              <CircleCheckGreenIcon className='mr-[11px]' />
            ) : (
              <CircleCheckGrayIcon className='mr-[11px]' />
            )}

            <Text className='text-b-md font-n-eb text-gray-700 items-center'>
              서비스 이용 약관 동의(전체)
            </Text>
          </Pressable>

          <View className='gap-y-[25px] mb-[25px]'>
            {TERMS.map(({ id, terms, essential }, idx) => {
              const checked = checkedSet.has(idx);
              return (
                <View
                  key={idx}
                  className='flex-row items-center justify-between'
                >
                  <Pressable
                    onPress={() => toggleItem(idx)}
                    className='flex-row items-center '
                    hitSlop={8}
                  >
                    <Svg
                      width={18}
                      height={18}
                      viewBox='0 0 18 18'
                      fill='none'
                      className='mr-[13px]'
                    >
                      <Path
                        d='M16.5 4.5L6.5 15L1.5 9'
                        stroke={checked ? '#50D88F' : '#C9CDD2'}
                        strokeWidth={1.5}
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </Svg>
                    {essential ? (
                      <Text
                        className={`text-b-sm font-n-bd text-gray-400 ${checked ? 'text-gray-700' : 'text-gray-400'}`}
                      >
                        [필수]
                      </Text>
                    ) : (
                      <Text
                        className={`text-b-sm font-n-bd text-gray-400 ${checked ? 'text-gray-700' : 'text-gray-400'}`}
                      >
                        [선택]
                      </Text>
                    )}
                    <Text
                      className={`ml-[2px] font-n-bd text-b-sm ${
                        !checked && 'text-b-sm text-gray-400'
                      }`}
                    >
                      {terms}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setIsTermsModalVisible(true);
                      setSelectedTerm(id);
                    }}
                  >
                    <RightArrowIcon />
                  </Pressable>
                </View>
              );
            })}
          </View>
          <LongButton
            label='동의하고 계속하기'
            onPress={onPressSubmit}
            disabled={!isEssentialChecked}
          />
        </View>
        <HomeFooterModal
          type={
            selectedTerm as
              | 'service'
              | 'privacy'
              | 'age'
              | 'appUsage'
              | 'notification'
          }
          visible={isTermsModalVisible}
          onClose={() => setIsTermsModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}
