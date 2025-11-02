import MoreIcon from '@/assets/icons/ic_arrow_down.svg';
import LessIcon from '@/assets/icons/ic_arrow_up.svg';
import LogoIcon from '@/assets/icons/ic_logo_word.svg';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { HomeFooterModal } from './HomeFooterModal';
import { HomeFooterRequestModal } from './HomeFooterRequestModal';

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View className='flex-row mb-2'>
    <Text className='w-28 text-sm font-n-rg text-gray-400'>{label}</Text>
    <Text className='flex-1 text-sm font-n-lt text-gray-500'>{value}</Text>
  </View>
);

export default function HomeFooter() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false);
  const [isReviewPolicyModalVisible, setIsReviewPolicyModalVisible] =
    useState(false);
  const [isAdInquiryModalVisible, setIsAdInquiryModalVisible] = useState(false);

  return (
    <View className='bg-white py-8 px-8 border-t border-gray-100'>
      <LogoIcon width={54} className='mb-3' />

      <TouchableOpacity
        className='flex-row items-center mb-4'
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <Text className='text-sm text-gray-700 font-n-lt mr-1'>사업자정보</Text>
        {isExpanded ? <LessIcon color='gray' /> : <MoreIcon color='gray' />}
      </TouchableOpacity>

      {isExpanded && (
        <View className='bg-gray-box p-4 rounded-xl mb-4'>
          <InfoRow label='상호명' value='포도상점' />
          <InfoRow label='대표자' value='서준' />
          <InfoRow
            label='주소'
            value='서울시 노원구 석계로 98-2 3층 스타트업 스테이션'
          />
          <InfoRow label='사업자등록번호' value='196-64-00773' />
          <InfoRow label='이메일' value='podosangjeom@gmail.com' />
        </View>
      )}

      <View className='flex-row items-center justify-between'>
        <TouchableOpacity onPress={() => setIsTermsModalVisible(true)}>
          <Text className='text-xs text-gray-600 underline'>
            서비스 이용 약관
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsPrivacyModalVisible(true)}>
          <Text className='text-xs text-gray-600 underline'>
            개인정보 처리방침
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsReviewPolicyModalVisible(true)}>
          <Text className='text-xs text-gray-600 underline'>리뷰운영정책</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsAdInquiryModalVisible(true)}>
          <Text className='text-xs text-gray-600 underline'>
            광고/제휴 문의
          </Text>
        </TouchableOpacity>
      </View>

      <HomeFooterModal
        type='footerService'
        visible={isTermsModalVisible}
        onClose={() => setIsTermsModalVisible(false)}
      />

      <HomeFooterModal
        type='footerPrivacyUsage'
        visible={isPrivacyModalVisible}
        onClose={() => setIsPrivacyModalVisible(false)}
      />

      <HomeFooterModal
        type='footerReviewPolicy'
        visible={isReviewPolicyModalVisible}
        onClose={() => setIsReviewPolicyModalVisible(false)}
      />

      <HomeFooterRequestModal
        visible={isAdInquiryModalVisible}
        onClose={() => setIsAdInquiryModalVisible(false)}
      />
    </View>
  );
}
