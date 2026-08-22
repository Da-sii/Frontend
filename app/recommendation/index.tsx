import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import HomeIcon from '@/assets/icons/ic_home.svg';
import Navigation from '@/components/layout/Navigation';
import { HomeFooterModal } from '@/components/page/home/HomeFooterModal';
import colors from '@/constants/color';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const analysisSteps = [
  {
    number: '1',
    title: '기본 정보 입력',
    description: '건강 목표, 나이대, 성별',
  },
  {
    number: '2',
    title: '생활 습관 확인',
    description: '운동, 카페인, 수면, 식사 등',
  },
  {
    number: '3',
    title: '맞춤 성분 추천',
    description: '내 상황에 최적화된 성분 TOP 3',
  },
];

export default function RecommendationAnalysisPage() {
  const router = useRouter();
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false);

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top', 'left', 'right']}>
      <Navigation
        title='맞춤 분석'
        left={<ArrowLeftIcon width={18} height={18} fill={colors.gray[900]} />}
        onLeftPress={() => router.back()}
        right={<HomeIcon width={18} height={18} fill={colors.gray[900]} />}
        onRightPress={() => router.replace('/(tabs)/home')}
      />

      <View className='h-px bg-gray-100' />

      <View className='flex-1 px-[20px] pt-[30px]'>
        <View className='items-center'>
          <Text className='text-center text-gray-900 text-h-lg font-n-eb'>
            나에게 <Text className='text-green-600'>딱 맞는</Text>
            {'\n'}
            보조제를 찾아드려요
          </Text>
          <Text className='mt-[20px] mb-[18px] text-center font-n-bd text-sm  text-gray-600'>
            9가지 질문으로 내 건강 상태와 생활 습관에{'\n'}
            최적화된 성분을 추천해드려요
          </Text>
        </View>

        <View className=' gap-y-[12px]'>
          {/* TODO: 다른 온보딩 단계에서도 사용 가능하도록 AnalysisStepCard 컴포넌트로 분리 */}
          {analysisSteps.map((step) => (
            <View
              key={step.number}
              className='py-[14px] flex-row items-center rounded-[14px] bg-white px-[16px]'
              style={{
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 7 },
                shadowOpacity: 0.06,
                shadowRadius: 15,
                elevation: 4,
              }}
            >
              <View className='h-[32px] w-[32px] items-center justify-center rounded-[10px] bg-green-50'>
                <Text className='text-sm text-green-500 font-n-eb'>
                  {step.number}
                </Text>
              </View>
              <View className='ml-[14px]'>
                <Text className='text-sm text-gray-900 font-n-eb'>
                  {step.title}
                </Text>
                <Text className='mt-[2px] font-n-bd text-c2  text-gray-400'>
                  {step.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className='mt-[20px] flex-row items-center justify-between'>
          <Text className='text-gray-500 font-n-bd text-c2'>
            [필수] 맞춤 분석 민감정보 수집 및 이용 동의
          </Text>
          <Pressable
            hitSlop={8}
            onPress={() => setIsPrivacyModalVisible(true)}
          >
            <Text className='text-gray-500 underline font-n-bd text-c2'>
              보기
            </Text>
          </Pressable>
        </View>

        {/* TODO: 약관 동의 흐름에서 재사용할 수 있도록 ConsentActionButtons 컴포넌트로 분리 */}
        <View className='mt-[20px] w-full flex-row gap-x-[10px]'>
          <TouchableOpacity
            activeOpacity={0.8}
            className='py-[12px] flex-1 items-center justify-center rounded-[17px] border border-green-500 bg-white'
          >
            <Text className='text-lg text-green-500 font-n-eb'>
              다음에 하기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/recommendation/survey' as never)}
            className='h-[66px] flex-[1.86] items-center justify-center rounded-[17px] bg-green-500'
          >
            <Text className='text-lg text-white font-n-eb'>
              동의 후 시작하기
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <HomeFooterModal
        type='recommendationPrivacy'
        visible={isPrivacyModalVisible}
        onClose={() => setIsPrivacyModalVisible(false)}
      />
    </SafeAreaView>
  );
}
