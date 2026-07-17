import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import smsInfoImg from '@/assets/images/img_sms_info.png';
import { LongButton } from '@/components/common/buttons/LongButton';
import DefaultModal from '@/components/common/modals/DefaultModal';
import Navigation from '@/components/layout/Navigation';
import {
  useSendOctomoAuth,
  useVerifyOctomoAuth,
} from '@/hooks/auth/usePhoneAuth';
import { useVerificationComplete } from '@/hooks/auth/useVerificationComplete';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  AppState,
  Image,
  Linking,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STEPS = [
  '[동의 및 휴대폰번호 확인] 버튼을 눌러주세요.',
  '메시지 작성 창에 번호 확인을 위한 인증 메시지가 자동으로 입력됩니다.',
  '인증 메시지를 수정없이 그대로 보내주세요.',
];

// 옥토모 발신 인증 수신 번호
const OCTOMO_NUMBER = '1666-3538';

export default function Octomo() {
  const { menu, phone } = useLocalSearchParams<{
    menu?: string;
    phone?: string;
  }>();
  const router = useRouter();
  const phoneNumber = phone ?? '';

  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const awaitingVerificationRef = useRef(awaitingVerification);
  useEffect(() => {
    awaitingVerificationRef.current = awaitingVerification;
  }, [awaitingVerification]);

  const { handleVerified, modalMessage, modalSecondMessage, visibleModal, setVisibleModal } =
    useVerificationComplete(menu, phoneNumber);

  // 발송/수신 확인 관련 에러는 확인 버튼 하나짜리 모달로 별도 처리
  // (findId/findPassword 실패 시 뜨는 회원가입 유도 모달과는 다른 용도)
  const [errorModal, setErrorModal] = useState({ visible: false, message: '' });

  const sendOctomoMutation = useSendOctomoAuth({
    onSuccess: (res) => {
      setAwaitingVerification(true);
      // iOS/Android sms: URI 스킴 차이(본문 파라미터 구분자) 대응
      const smsUrl =
        Platform.OS === 'ios'
          ? `sms:${OCTOMO_NUMBER}&body=${encodeURIComponent(res.code)}`
          : `sms:${OCTOMO_NUMBER}?body=${encodeURIComponent(res.code)}`;

      Linking.openURL(smsUrl).catch(() => {
        setAwaitingVerification(false);
        setErrorModal({
          visible: true,
          message:
            '문자 앱을 열 수 없어요. 문자 인증이 가능한 기기에서 시도해 주세요.',
        });
      });
    },
    onError: (err: any) => {
      setErrorModal({
        visible: true,
        message: err?.response?.data?.error || '인증 요청 중 오류가 발생했어요.',
      });
    },
  });

  const verifyOctomoMutation = useVerifyOctomoAuth({
    onSuccess: (data) => {
      setAwaitingVerification(false);
      handleVerified(data.verification_token);
    },
    onError: (err: any) => {
      setAwaitingVerification(false);
      const serverMessage: string = err?.response?.data?.error || '';
      const message = serverMessage.includes('만료')
        ? '인증 시간이 만료되었습니다.\n다시 인증을 진행해 주세요.'
        : '간편인증 메시지가 일치하지 않습니다.\n다시 발송해 주시기 바랍니다.';
      setErrorModal({ visible: true, message });
    },
  });

  // 문자 앱에서 돌아와 화면이 다시 활성화되면 자동으로 수신 여부 확인
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active' && awaitingVerificationRef.current) {
        verifyOctomoMutation.mutate(phoneNumber);
      }
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneNumber]);

  const isLoading =
    sendOctomoMutation.isPending || verifyOctomoMutation.isPending;

  const onPressConfirm = () => {
    sendOctomoMutation.mutate(phoneNumber);
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <Navigation
        left={<ArrowLeftIcon width={20} height={20} />}
        onLeftPress={() => router.back()}
      />

      <View className='flex-1 p-5'>
        <Text className='text-h-lg font-n-eb text-gray-700 mb-[12px]'>
          휴대폰 본인확인
        </Text>

        <View className='gap-y-[12px] mb-[20px]'>
          {STEPS.map((step, i) => (
            <View key={i} className='flex-row'>
              <View className='w-5 h-5 rounded-full bg-green-500 items-center justify-center mr-2 mt-[1px]'>
                <Text className='text-white text-c2 font-n-eb'>{i + 1}</Text>
              </View>
              <Text className='flex-1 text-gray-700 text-b-md font-n-bd'>
                {step}
              </Text>
            </View>
          ))}
        </View>

        {/* 남는 세로 공간만큼만 차지 → 화면이 작으면 이미지가 비율 유지한 채 자동으로 줄어듦 */}
        <View className='items-center justify-center flex-1'>
          <Image
            source={smsInfoImg}
            className='w-[70%] max-w-[270px]'
            style={{ aspectRatio: 270 / 208 }}
            resizeMode='contain'
          />
        </View>

        <View className='items-center mb-[10px]'>
          <View className='w-[70%] max-w-[270px]'>
            <Text className='text-gray-400 text-c3 font-n-bd'>
              ※ 이용 중인 통신 요금제에 따라 통화료가 발생할 수 있습니다.
            </Text>
            <Text className='text-gray-400 text-c3 font-n-bd'>
              ※ 전화번호가 등록된 기기에서만 인증하실 수 있습니다.
            </Text>
          </View>
        </View>
      </View>

      <View className='items-center mb-[25px]'>
        <Pressable
          onPress={() =>
            router.push({ pathname: '/auth/phone/sms', params: { menu } })
          }
        >
          <Text className='text-gray-500 underline font-n-bd text-b-sm'>
            다른 인증 방식을 원하시나요?
          </Text>
        </Pressable>
      </View>

      <View className='p-5'>
        <LongButton
          label={isLoading ? '인증 확인 중...' : '동의 및 휴대폰번호 확인'}
          onPress={onPressConfirm}
          disabled={isLoading}
        />
      </View>

      <DefaultModal
        visible={visibleModal}
        onConfirm={() => {
          setVisibleModal(false);
          router.replace('/auth/signUp');
        }}
        onCancel={() => setVisibleModal(false)}
        message={modalMessage}
        secondMessage={modalSecondMessage}
        confirmText='회원가입'
        cancelText='취소'
      />

      <DefaultModal
        visible={errorModal.visible}
        singleButton
        confirmText='확인'
        message={errorModal.message}
        onConfirm={() => setErrorModal({ visible: false, message: '' })}
        onCancel={() => setErrorModal({ visible: false, message: '' })}
      />
    </SafeAreaView>
  );
}
