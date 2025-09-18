import CircleCheckGrayIcon from '@/assets/icons/auth/ic_circle_check_gray.svg';
import CircleCheckGreenIcon from '@/assets/icons/auth/ic_circle_check_green.svg';
import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import RightArrowIcon from '@/assets/icons/ic_arrow_right.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import { TextField } from '@/components/common/Inputs/TextField';
import Navigation from '@/components/layout/Navigation';
import BottomSheetLayout from '@/components/page/product/productDetail/BottomSeetLayout';
import { useSignup } from '@/hooks/useSignUp';
import {
  hasPasswordComposition,
  isEmail,
  isLen8to20,
  isSamePassword,
} from '@/utils/validation';
import BottomSheet from '@gorhom/bottom-sheet';
import { PortalProvider } from '@gorhom/portal';
import { Stack, useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { useSignupDraft } from '@/store/useSignupDraft';
import Svg, { Path } from 'react-native-svg';
const TERMS: { id: string; terms: string; essential: boolean }[] = [
  { id: 'service', terms: '이용 약관 동의', essential: true },
  { id: 'privacy', terms: '개인정보 수집/이용 동의', essential: true },
  { id: 'age', terms: '연령 제한 및 법적 규정 동의', essential: true },
  { id: 'appUsage', terms: '앱 이용 정보 수집 동의', essential: true },
  { id: 'notification', terms: '알림 및 푸시 알림 동의', essential: false },
];

export default function Index() {
  const router = useRouter();
  const [checkedSet, setCheckedSet] = useState<Set<number>>(new Set());
  const {
    email,
    password,
    confirmPassword,
    setEmail,
    setPassword,
    setConfirmPassword,
  } = useSignupDraft();

  // ===== BottomSheet =====
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [462], []);
  const openSheet = () => {
    sheetRef.current?.snapToIndex?.(0); // 첫 스냅으로 열기
  };
  const closeSheet = () => sheetRef.current?.close();

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

  const canSubmit = useMemo(() => {
    return (
      isEmail(email) &&
      isLen8to20(password) &&
      hasPasswordComposition(password) &&
      isSamePassword(password, confirmPassword)
    );
  }, [email, password, confirmPassword]);

  const signupMutation = useSignup({
    onSuccess: (data) => {
      router.replace('/auth/phone');
    },
  });

  const onPressSubmit = async () => {
    if (!canSubmit) return;
    router.push('/auth/phone');
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <PortalProvider>
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
            onPress={openSheet}
            disabled={!canSubmit}
          />
        </View>

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

              <Text className='text-b-md font-extrabold text-gray-700 items-center'>
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
                          stroke={checked ? '#181A1B' : '#C9CDD2'}
                          strokeWidth={1.5}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </Svg>
                      {essential ? (
                        <Text
                          className={`text-b-sm font-bold text-gray-400 ${checked ? 'text-gray-700' : 'text-gray-400'}`}
                        >
                          [필수]
                        </Text>
                      ) : (
                        <Text
                          className={`text-b-sm font-bold text-gray-400 ${checked ? 'text-gray-700' : 'text-gray-400'}`}
                        >
                          [선택]
                        </Text>
                      )}
                      <Text
                        className={`ml-[2px] font-bold text-b-sm ${
                          !checked && 'text-b-sm text-gray-400'
                        }`}
                      >
                        {terms}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => router.push(`/auth/signUp/terms/${id}`)}
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
      </PortalProvider>
    </SafeAreaView>
  );
}
