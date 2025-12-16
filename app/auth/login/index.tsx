import CircleCheckGrayIcon from '@/assets/icons/auth/ic_circle_check_gray.svg';
import CircleCheckGreenIcon from '@/assets/icons/auth/ic_circle_check_green.svg';
import XIcon from '@/assets/icons/auth/ic_emergency_x.svg';
import AppleIcon from '@/assets/icons/ic_apple.svg';
import RightArrowIcon from '@/assets/icons/ic_arrow_right.svg';
import EmailIcon from '@/assets/icons/ic_email.svg';
import Logo from '@/assets/icons/ic_logo_start.svg';
import LoginButton from '@/components/common/buttons/LoginButton';
import { LongButton } from '@/components/common/buttons/LongButton';
import Navigation from '@/components/layout/Navigation';
import { HomeFooterModal } from '@/components/page/home/HomeFooterModal';
import KakaoLogin from '@/components/page/login/kakaoLogin';
import BottomSheetLayout from '@/components/page/product/productDetail/BottomSeetLayout';
import { useAppleLogin } from '@/hooks/auth/useAppleLogin';
import { useKakaoLogin } from '@/hooks/useKakaoLogin';
import BottomSheet from '@gorhom/bottom-sheet';
import { PortalProvider } from '@gorhom/portal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const TERMS: { id: string; terms: string; essential: boolean }[] = [
  { id: 'service', terms: '이용 약관 동의', essential: true },
  { id: 'privacy', terms: '개인정보 수집/이용 동의', essential: true },
  { id: 'age', terms: '연령 제한 및 법적 규정 동의', essential: true },
  { id: 'appUsage', terms: '앱 이용 정보 수집 동의', essential: true },
  { id: 'notification', terms: '알림 및 푸시 알림 동의', essential: false },
];

export default function Index({ emergency }: { emergency?: string }) {
  const { width, height } = useWindowDimensions();
  const aspectRatio = width / height;

  const router = useRouter();
  const appleLogin = useAppleLogin();
  const [forceReauth, setForceReauth] = useState(false);
  const [checkedSet, setCheckedSet] = useState<Set<number>>(new Set());
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const kakaoLogin = useKakaoLogin();

  // ===== BottomSheet =====
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [462], []);
  const openSheet = () => {
    sheetRef.current?.snapToIndex?.(0);
  };

  const isTabletRatio =
    Math.abs(aspectRatio - 4 / 3) < 0.2 || Math.abs(aspectRatio - 3 / 4) < 0.2;

  const scrollClassName = isTabletRatio ? 'pb-[100px]' : '';

  useEffect(() => {
    AsyncStorage.getItem('forceReauth').then((value) => {
      if (value === 'true') {
        setForceReauth(true);
        AsyncStorage.removeItem('forceReauth');
      }
    });
  }, []);

  // 필수 항목 인덱스
  const essentialIdxs = useMemo(
    () => TERMS.map((t, i) => (t.essential ? i : -1)).filter((i) => i !== -1),
    [],
  );

  // 전체 선택 여부 / 필수 항목 모두 선택 여부
  const isAllChecked = checkedSet.size === TERMS.length;
  const isEssentialChecked = useMemo(
    () => essentialIdxs.every((i) => checkedSet.has(i)),
    [checkedSet, essentialIdxs],
  );

  // 개별 토글
  const toggleItem = (idx: number) => {
    setCheckedSet((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // 전체 토글
  const toggleAll = () => {
    setCheckedSet((prev) =>
      prev.size === TERMS.length ? new Set() : new Set(TERMS.map((_, i) => i)),
    );
  };

  const onPressSubmit = async () => {
    sheetRef.current?.close?.();
    router.replace('/home');
  };

  return (
    <PortalProvider>
      <SafeAreaView className='flex-1 bg-white'>
        <Stack.Screen options={{ headerShown: false }} />
        {emergency && (
          <Navigation right={<XIcon />} onRightPress={() => router.back()} />
        )}

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          className={scrollClassName}
        >
          <View className='flex-1 items-center'>
            <View className='items-center w-full justify-center h-[64.98%]'>
              <Logo width={112} height={33} />
              <View className='flex-col items-center mt-[18px] '>
                <Text className='text-b-sm font-n-rg text-gray-900'>
                  다이어트 필수 정보,
                </Text>
                <Text className='text-b-sm font-n-rg text-gray-900'>
                  보조제 성분부터 후기까지 한번에
                </Text>
              </View>
            </View>

            <View className=' w-full px-5 flex-col space-y-3'>
              <KakaoLogin
                onPress={() => {
                  kakaoLogin.mutate(undefined, {
                    onSuccess: (data) => {
                      if (data.is_new_user) {
                        openSheet();
                      } else {
                        router.replace('/home');
                      }
                    },
                  });
                }}
              />
              <LoginButton
                label='Apple로 로그인'
                onPress={() => {
                  appleLogin();
                }}
                color='bg-[#000]'
                Icon={AppleIcon}
                textColor='text-white'
                border='border-none'
                IconWidth={16}
                IconHeight={20}
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

            {!emergency && (
              <View className='flex-row items-center justify-center mt-[10px]'>
                <Text className='text-b-sm font-n-rg text-gray-500'>
                  서비스가 궁금하시다면?
                </Text>

                <Pressable
                  onPress={() => {
                    router.replace('/home');
                  }}
                >
                  <Text className='text-b-md font-n-eb text-[#19B375] ml-1'>
                    둘러보기
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>

        <BottomSheetLayout snapPoints={snapPoints} sheetRef={sheetRef}>
          {/* ===== 서비스 약관 동의 ===== */}
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
        </BottomSheetLayout>
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
      </SafeAreaView>
    </PortalProvider>
  );
}
