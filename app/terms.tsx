// app/terms.tsx

import CircleCheckGrayIcon from '@/assets/icons/auth/ic_circle_check_gray.svg';
import CircleCheckGreenIcon from '@/assets/icons/auth/ic_circle_check_green.svg';
import RightArrowIcon from '@/assets/icons/ic_arrow_right.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import Navigation from '@/components/layout/Navigation';
import { HomeFooterModal } from '@/components/page/home/HomeFooterModal';
import { patchTermsAgreed } from '@/services/auth/terms';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const TERMS: { id: string; terms: string; essential: boolean }[] = [
  { id: 'service', terms: '이용 약관 동의', essential: true },
  { id: 'privacy', terms: '개인정보 수집/이용 동의', essential: true },
  { id: 'age', terms: '연령 제한 및 법적 규정 동의', essential: true },
  { id: 'appUsage', terms: '앱 이용 정보 수집 동의', essential: true },
  { id: 'notification', terms: '알림 및 푸시 알림 동의', essential: false },
];

export default function Terms() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>(); // mode='terms' 로 들어올 수 있음

  const [checkedSet, setCheckedSet] = useState<Set<number>>(new Set());
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const qc = useQueryClient();

  const essentialIdxs = useMemo(
    () => TERMS.map((t, i) => (t.essential ? i : -1)).filter((i) => i !== -1),
    [],
  );

  const isAllChecked = checkedSet.size === TERMS.length;
  const isEssentialChecked = essentialIdxs.every((i) => checkedSet.has(i));

  const toggleAll = () => {
    setCheckedSet((prev) =>
      prev.size === TERMS.length ? new Set() : new Set(TERMS.map((_, i) => i)),
    );
  };

  const toggleItem = (idx: number) => {
    setCheckedSet((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const onPressSubmit = async () => {
    try {
      await AsyncStorage.removeItem('pendingAgreement'); // 기존 키 쓰고 있으면 유지

      await patchTermsAgreed({ is_terms_agreed: true });
      qc.setQueryData(['mainScreen'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          user: {
            ...old.user,
            isTermsAgreed: true,
          },
        };
      });

      qc.invalidateQueries({ queryKey: ['mainScreen'] });

      // ✅ 약관 동의 후 홈(index)로
      router.replace('/home');
    } catch (e) {
      console.log('terms patch error:', e);
      router.replace('/auth/login');
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <Navigation title='서비스 이용 약관' />
      <View className='flex-1'>
        <View className='flex-col justify-between flex-1 px-5'>
          <View>
            <Pressable
              onPress={toggleAll}
              className='flex-row items-center mb-[28px]'
              hitSlop={8}
            >
              {isAllChecked ? (
                <CircleCheckGreenIcon className='mr-[11px]' />
              ) : (
                <CircleCheckGrayIcon className='mr-[11px]' />
              )}

              <Text className='items-center text-gray-700 text-b-lg font-n-eb'>
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
                      className='flex-row items-center'
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

                      <Text
                        className={`text-b-sm font-n-bd ${
                          checked ? 'text-gray-700' : 'text-gray-400'
                        }`}
                      >
                        {essential ? '[필수]' : '[선택]'}
                      </Text>

                      <Text
                        className={`ml-[2px] font-n-bd text-b-sm ${
                          checked ? 'text-gray-700' : 'text-gray-400'
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
          </View>

          <LongButton
            label={mode === 'terms' ? '동의하고 계속하기' : '동의하기'}
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
