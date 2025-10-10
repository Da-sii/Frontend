import DepthIcon from '@/assets/icons/ic_arrow_right.svg';
import { TextField } from '@/components/common/Inputs/TextField';
import { LongButton } from '@/components/common/buttons/LongButton';
import DefaultModal from '@/components/common/modals/DefaultModal';
import Navigation from '@/components/layout/Navigation';
import { isEmail } from '@/utils/validation';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import CheckboxInput from './CheckboxInput';
import { HomeFooterModal } from './HomeFooterModal';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

export const HomeFooterRequestModal = ({ visible, onClose }: ModalProps) => {
  const [visibleErrorModal, setVisibleErrorModal] = useState(false);

  const [requestType, setRequestType] = useState(0);
  const [brandRelease, setBrandRelease] = useState(0);
  const [privacyAgree, setPrivacyAgree] = useState(false);
  const [showPrivacyAgree, setShowPrivacyAgree] = useState(false);

  const [brandName, setBrandName] = useState('');
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (
      !requestType ||
      !brandName ||
      content.length < 20 ||
      !name ||
      !phone ||
      !isEmail(email) ||
      !privacyAgree
    ) {
      setVisibleErrorModal(true);
      return;
    }

    const requestTypeText = {
      1: '국내 광고 문의',
      2: '글로벌 광고 문의',
      3: '기타 문의 (제휴 등)',
    }[requestType];
    const brandReleaseText = {
      1: '출시 완료',
      2: '미출시 (1개월 내)',
      3: '미출시 (3개월 내)',
      4: '미출시 (3개월 이상)',
    }[brandRelease];

    const to = 'podostore1111@gmail.com';
    const subject = `[광고/제휴 문의] ${brandName} 브랜드`;
    const body = `
  안녕하세요, 광고/제휴 관련하여 문의 드립니다.
  
  ---------------------------------
  
  [문의 정보]
  - 문의 유형: ${requestTypeText}
  - 담당 브랜드명: ${brandName}
  - 브랜드 출시 여부: ${brandReleaseText}
  - 문의 내용:
  ${content}
  
  [담당자 정보]
  - 성함: ${name}
  - 연락처: ${phone}
  - 이메일: ${email}
  - 개인정보 수집 동의: ${privacyAgree ? '완료' : '미동의'}
  
  ---------------------------------
    `;

    const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch(() => {
      Alert.alert(
        '오류',
        '메일 앱을 열 수 없습니다. 기기에 이메일 앱이 설치되어 있는지 확인해주세요.',
      );
    });
  };

  return (
    <Modal
      animationType='slide'
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView className='flex-1'>
        <Navigation
          right={<Ionicons name='close' size={25} color='black' />}
          onRightPress={onClose}
          title='광고/제휴 문의'
        />

        <ScrollView className='p-4 pt-0'>
          <View className='text-base text-gray-800 leading-6'>
            <Text className='text-2xl font-bold mb-2'>다시, 광고 문의하기</Text>
            <Text className='text-[13px] font-regular'>
              광고 및 제휴 관련 문의사항이 있으신 경우, 하기 폼을 입력해주시면{' '}
              {'\n'}
              담당자가 확인 후 영업일 기준 1일 내로 답변드리겠습니다.
            </Text>
          </View>

          <View className='py-3 pb-3'>
            <View className='flex-row mb-1'>
              <Text className='font-semibold text-red-500'>*</Text>
              <Text className='font-semibold'> 문의 유형</Text>
            </View>

            <View className=''>
              <CheckboxInput
                label='국내 광고 문의'
                isSelected={requestType === 1}
                onPress={() => setRequestType(1)}
              />
              <CheckboxInput
                label='글로벌 광고 문의'
                isSelected={requestType === 2}
                onPress={() => setRequestType(2)}
              />
              <CheckboxInput
                label='기타 문의 (제휴 등)'
                isSelected={requestType === 3}
                onPress={() => setRequestType(3)}
              />
            </View>
          </View>

          <View className='h-[1px] bg-gray-100' />

          <View className='py-3 pb-3'>
            <View className='flex-row mb-3'>
              <Text className='font-semibold text-red-500'>*</Text>
              <Text className='font-semibold'> 담당 브랜드명</Text>
            </View>

            <TextField
              menu={1}
              value={brandName}
              onChangeText={setBrandName}
              secureTextEntry={false}
              placeholder='담당 브랜드명을 입력해주세요.'
              maxLength={20}
            />
          </View>

          <View className='h-[1px] bg-gray-100' />

          <View className='py-3 pb-3'>
            <View className='flex-row mb-1'>
              <Text className='font-semibold text-red-500'>*</Text>
              <Text className='font-semibold'> 브랜드 출시 여부</Text>
            </View>
            <View className=''>
              <CheckboxInput
                label='출시 완료'
                isSelected={brandRelease === 1}
                onPress={() => setBrandRelease(1)}
              />

              <CheckboxInput
                label='미출시 (1개월 내 출시 예정)'
                isSelected={brandRelease === 2}
                onPress={() => setBrandRelease(2)}
              />

              <CheckboxInput
                label='미출시 (3개월 내 출시 예정)'
                isSelected={brandRelease === 3}
                onPress={() => setBrandRelease(3)}
              />

              <CheckboxInput
                label='미출시 (3개월 이상 소요 예정)'
                isSelected={brandRelease === 4}
                onPress={() => setBrandRelease(4)}
              />
            </View>
          </View>

          <View className='h-[1px] bg-gray-100' />

          <View className='py-3 pb-5'>
            <View className='flex-row mb-3'>
              <Text className='font-semibold text-red-500'>*</Text>
              <Text className='font-semibold'> 문의 내용</Text>
            </View>

            <View className='border border-gray-100 rounded-[12px] p-[15px] pb-[40px] h-[150px] text-b-md relative'>
              <TextInput
                placeholder={`광고 진행 예정일 및 목적을 자세하게 작성해주세요.`}
                value={content}
                onChangeText={setContent}
                multiline
                placeholderTextColor='#60676C'
              />
            </View>

            <View className='flex-row items-center absolute bottom-9 right-5'>
              <Text className='text-xs font-semibold text-gray-700'>
                {content.length}
              </Text>
              <Text className='text-xs font-light text-gray-400'>
                {' '}
                / 1,000 (최소 20자)
              </Text>
            </View>
          </View>

          <View className='h-[1px] bg-gray-100' />

          <View className='py-3 pb-3'>
            <View className='flex-row mb-3'>
              <Text className='font-semibold text-red-500'>*</Text>
              <Text className='font-semibold'> 성함</Text>
            </View>

            <TextField
              menu={1}
              value={name}
              onChangeText={setName}
              secureTextEntry={false}
              placeholder='성함을 입력해주세요.'
              maxLength={20}
            />
          </View>

          <View className='h-[1px] bg-gray-100' />

          <View className='py-3 pb-3'>
            <View className='flex-row mb-3'>
              <Text className='font-semibold text-red-500'>*</Text>
              <Text className='font-semibold'> 연락처</Text>
            </View>
            <TextField
              menu={1}
              value={phone}
              onChangeText={setPhone}
              secureTextEntry={false}
              placeholder='연락처를 입력해주세요.'
              maxLength={20}
            />
          </View>

          <View className='h-[1px] bg-gray-100' />

          <View className='py-3 pb-3'>
            <View className='flex-row mb-3'>
              <Text className='font-semibold text-red-500'>*</Text>
              <Text className='font-semibold'> 이메일 주소</Text>
            </View>
            <TextField
              menu={1}
              value={email}
              onChangeText={setEmail}
              secureTextEntry={false}
              placeholder='이메일 주소를 입력해주세요.'
              maxLength={20}
              firstMessage='이메일 형식'
              validateFirst={isEmail}
            />
          </View>

          <View className='h-[1px] bg-gray-100 mb-3' />

          <View className='flex-row justify-between items-center mb-12'>
            <View className='flex-row items-center'>
              <Text className='font-semibold text-red-500 mr-2'>*</Text>
              <CheckboxInput
                label='개인정보 수집 및 이용 동의'
                isSelected={privacyAgree}
                onPress={() => setPrivacyAgree(!privacyAgree)}
              />
            </View>
            <DepthIcon
              width={15}
              height={15}
              onPress={() => setShowPrivacyAgree(true)}
            />
          </View>

          <LongButton label='제출하기' onPress={handleSubmit} />
        </ScrollView>
      </SafeAreaView>

      <HomeFooterModal
        type='inquiryAppUsage'
        visible={showPrivacyAgree}
        onClose={() => setShowPrivacyAgree(false)}
      />

      <DefaultModal
        visible={visibleErrorModal}
        onConfirm={() => setVisibleErrorModal(false)}
        onCancel={() => setVisibleErrorModal(false)}
        title='입력 오류'
        message='모든 필수 항목을 올바르게 입력해주세요.'
        singleButton
      />
    </Modal>
  );
};
