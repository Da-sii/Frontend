'use client';

import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import ArrowRightIcon from '@/assets/icons/ic_arrow_right.svg';

import HomeIcon from '@/assets/icons/ic_home.svg';
import DefaultModal from '@/components/common/modals/DefaultModal';
import Navigation from '@/components/layout/Navigation';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// --- Mock Data ---
const ingredientData: Record<
  string,
  {
    name: string;
    subName: string;
    keyPoints: string[];
    sources: string[];
    productCount: number;
  }
> = {
  '1': {
    name: '가르시니아 캄보지아 추출물',
    subName: 'Hydroxycitric Acid',
    keyPoints: [
      '열대 과일 가르시니아 캄보지아의 껍질에서 추출한 성분으로, 주요 활성 성분은 하이드록시시트르산(HCA)입니다.',
      '지방 합성을 억제하고 식욕을 줄이는 데 도움을 줄 수 있으며, 체중 관리에 활용됩니다.',
      '과다 섭취 시 두통, 소화 불량, 간 손상 등의 부작용이 보고된 사례가 있어 적정 용량 준수가 중요합니다.',
    ],
    sources: [
      'https://www.healthline.com/nutrition/garcinia-cambogia-weight-loss',
      'https://www.healddthline.com/nutrition/garcinia-cambogia-weight-losssss',
    ],
    productCount: 42,
  },
  '2': {
    name: '밀크씨슬추출물',
    subName: 'Silymarin',
    keyPoints: [
      '밀크씨슬(엉겅퀴과 식물)의 씨앗에서 추출한 성분으로, 실리마린이 주요 활성 성분입니다.',
      '간세포 보호 및 간 기능 개선에 도움을 줄 수 있으며, 항산화 효과가 있습니다.',
      '일반적으로 안전한 편이나, 과량 복용 시 소화 장애가 나타날 수 있습니다.',
    ],
    sources: ['https://www.nccih.nih.gov/health/milk-thistle'],
    productCount: 38,
  },
  '3': {
    name: '녹차추출물',
    subName: 'Green Tea Extract',
    keyPoints: [
      '녹차 잎에서 추출한 성분으로, 카테킨(EGCG)이 주요 활성 성분입니다.',
      '항산화 효과와 체지방 감소, 에너지 대사 촉진에 도움이 될 수 있습니다.',
      '카페인을 함유하므로 카페인 민감자나 임산부는 섭취에 주의가 필요합니다.',
    ],
    sources: [
      'https://www.healthline.com/nutrition/top-10-evidence-based-health-benefits-of-green-tea',
    ],
    productCount: 67,
  },
  '4': {
    name: '가르시니아 캄보지아 추출물',
    subName: 'Hydroxycitric Acid',
    keyPoints: [
      '열대 과일 가르시니아 캄보지아의 껍질에서 추출한 성분으로, 주요 활성 성분은 하이드록시시트르산(HCA)입니다.',
      '지방 합성을 억제하고 식욕을 줄이는 데 도움을 줄 수 있으며, 체중 관리에 활용됩니다.',
      '과다 섭취 시 두통, 소화 불량, 간 손상 등의 부작용이 보고된 사례가 있어 적정 용량 준수가 중요합니다.',
    ],
    sources: [
      'https://www.healthline.com/nutrition/garcinia-cambogia-weight-loss',
    ],
    productCount: 42,
  },
  '5': {
    name: '밀크씨슬추출물',
    subName: 'Silymarin',
    keyPoints: [
      '밀크씨슬(엉겅퀴과 식물)의 씨앗에서 추출한 성분으로, 실리마린이 주요 활성 성분입니다.',
      '간세포 보호 및 간 기능 개선에 도움을 줄 수 있으며, 항산화 효과가 있습니다.',
      '일반적으로 안전한 편이나, 과량 복용 시 소화 장애가 나타날 수 있습니다.',
    ],
    sources: ['https://www.nccih.nih.gov/health/milk-thistle'],
    productCount: 38,
  },
  '6': {
    name: '녹차추출물',
    subName: 'Green Tea Extract',
    keyPoints: [
      '녹차 잎에서 추출한 성분으로, 카테킨(EGCG)이 주요 활성 성분입니다.',
      '항산화 효과와 체지방 감소, 에너지 대사 촉진에 도움이 될 수 있습니다.',
      '카페인을 함유하므로 카페인 민감자나 임산부는 섭취에 주의가 필요합니다.',
    ],
    sources: [
      'https://www.healthline.com/nutrition/top-10-evidence-based-health-benefits-of-green-tea',
    ],
    productCount: 67,
  },
  '7': {
    name: '코엔자임Q10',
    subName: 'Coenzyme Q10',
    keyPoints: [
      '체내에서 자연적으로 생성되는 항산화 물질로, 세포의 에너지 생산에 필수적인 역할을 합니다.',
      '심혈관 건강 지원, 항산화 작용, 피부 노화 억제에 도움이 될 수 있습니다.',
      '스타틴 계열 약물 복용자의 경우 CoQ10 수치가 낮아질 수 있어 보충이 권장되기도 합니다.',
    ],
    sources: ['https://www.healthline.com/nutrition/coenzyme-q10'],
    productCount: 29,
  },
  '8': {
    name: '비타민C (아스코르브산)',
    subName: 'Ascorbic Acid',
    keyPoints: [
      '수용성 비타민으로 체내에서 합성되지 않아 식품이나 보충제를 통한 섭취가 필요합니다.',
      '면역 기능 강화, 콜라겐 합성 지원, 항산화 효과 등 다양한 생리적 기능에 관여합니다.',
      '고용량 복용 시 소화 장애, 신장 결석 위험이 있으므로 하루 상한 섭취량(2,000mg)을 초과하지 않도록 주의합니다.',
    ],
    sources: ['https://ods.od.nih.gov/factsheets/VitaminC-Consumer/'],
    productCount: 112,
  },
  '9': {
    name: '콜라겐 펩타이드',
    subName: 'Collagen Peptide',
    keyPoints: [
      '콜라겐을 가수분해하여 흡수율을 높인 형태로, 피부·관절·뼈 건강에 활용됩니다.',
      '피부 탄력 개선, 관절 통증 완화, 뼈 밀도 유지에 도움이 될 수 있다는 연구 결과가 있습니다.',
      '동물성 원료(소·돼지·어류) 유래이므로 채식주의자나 특정 종교적 식이 제한이 있는 경우 원료 확인이 필요합니다.',
    ],
    sources: ['https://www.healthline.com/nutrition/collagen'],
    productCount: 55,
  },
  '10': {
    name: '프로바이오틱스',
    subName: 'Probiotics',
    keyPoints: [
      '장내 유익균을 공급하여 장 건강을 지원하는 살아있는 미생물입니다.',
      '장 건강 개선, 면역 강화, 소화 기능 향상에 도움이 될 수 있으며 다양한 균주가 존재합니다.',
      '면역이 저하된 상태이거나 중증 질환이 있는 경우 복용 전 의료 전문가와 상담하는 것이 좋습니다.',
    ],
    sources: [
      'https://www.nccih.nih.gov/health/probiotics-what-you-need-to-know',
    ],
    productCount: 83,
  },
  '11': {
    name: '루테인',
    subName: 'Lutein',
    keyPoints: [
      '카로티노이드 계열의 항산화 성분으로 주로 눈의 황반 부위에 집중되어 있습니다.',
      '청색광 차단 및 산화 스트레스로부터 눈을 보호하며, 황반변성 예방에 도움이 될 수 있습니다.',
      '지용성 성분이므로 식사와 함께 섭취하면 흡수율이 높아집니다.',
    ],
    sources: [
      'https://www.aao.org/eye-health/tips-prevention/lutein-nutrition-eye-benefits',
    ],
    productCount: 47,
  },
  '12': {
    name: '오메가3',
    subName: 'Omega-3 Fatty Acids',
    keyPoints: [
      'EPA와 DHA를 주성분으로 하는 필수 지방산으로, 주로 등푸른 생선에서 유래합니다.',
      '심혈관 건강 개선, 중성지방 감소, 항염 효과 및 뇌 건강 지원에 도움이 될 수 있습니다.',
      '혈액 응고를 억제할 수 있으므로 항혈전제 복용 중인 경우 의사와 상담 후 섭취를 권장합니다.',
    ],
    sources: ['https://ods.od.nih.gov/factsheets/Omega3FattyAcids-Consumer/'],
    productCount: 94,
  },
};

const fallbackData = {
  name: '알 수 없는 성분',
  subName: 'Unknown Ingredient',
  keyPoints: ['해당 성분에 대한 정보를 찾을 수 없습니다.'],
  sources: [],
  productCount: 0,
};

export default function IngredientDetailPage() {
  const router = useRouter();
  const { id, from, productName } = useLocalSearchParams<{
    id: string;
    from?: 'list' | 'product';
    productName?: string;
  }>();

  const ingredient = ingredientData[id ?? ''] ?? fallbackData;
  const headerTitle =
    from === 'product' && productName ? productName : '성분 가이드';
  const [showSourceModal, setShowSourceModal] = useState(false);

  return (
    <SafeAreaView className='bg-white flex-1'>
      {/* 헤더 */}
      <View className='border-b border-gray-50'>
        <Navigation
          title={headerTitle}
          left={<ArrowLeftIcon width={18} height={18} />}
          onLeftPress={() => router.back()}
          right={
            <Pressable onPress={() => router.push('/home')}>
              <HomeIcon width={18} height={18} />
            </Pressable>
          }
          onRightPress={() => router.push('/')}
        />
      </View>

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {/* 성분명 헤더 영역 */}
        <View className='items-center pt-5 pb-5 text-center'>
          <Text className='font-n-eb'>{ingredient.name}</Text>
          <Text className='text-c3 text-gray-400 mt-1'>
            (주성분 : {ingredient.subName})
          </Text>
        </View>

        {/* 핵심 포인트 카드 */}
        <LinearGradient
          colors={['#FDFFFB', '#F5FDFE']}
          locations={[0, 0.7, 0.95, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className='mx-4 mb-[10px] rounded-2xl px-4 py-4'
          style={{
            borderWidth: 1,
            borderColor: '#82E3AF33',
          }}
        >
          <Text className='text-sm font-n-eb text-gray-800 mb-5'>
            핵심 포인트
          </Text>
          <View className='gap-y-3'>
            {ingredient.keyPoints.map((point, index) => (
              <View key={index} className='flex-row items-start gap-x-2'>
                <Text className='text-sm mt-[1px]'>•</Text>
                <Text className='text-sm flex-1 leading-5'>{point}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* 출처 링크 */}
        {ingredient.sources.length > 0 ? (
          <View className='mx-[30px] mb-6'>
            <Pressable onPress={() => setShowSourceModal(true)}>
              <Text className='text-xs text-gray-400 underline'>
                출처 자세히 보기
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* 이 성분이 포함된 제품 보러가기 버튼 */}
        <View className='mx-4'>
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/home/search',
                params: { word: ingredient.name },
              })
            }
            className='flex-row items-center justify-center py-4 rounded-2xl border border-gray-200 active:bg-gray-50'
          >
            <View className='flex-row items-center  mr-[10px]'>
              <Text className='text-c1 font-semibold'>
                이 성분이 포함된 제품{' '}
              </Text>
              <Text className='text-c1 text-green-600 font-n-eb'>
                {ingredient.productCount}개
              </Text>
              <Text className='text-c1 font-semibold'> 보러가기</Text>
            </View>
            <ArrowRightIcon width={12} height={12} />
          </Pressable>
        </View>
      </ScrollView>
      <DefaultModal
        visible={showSourceModal}
        title='출처'
        onConfirm={() => setShowSourceModal(false)}
        confirmText='확인'
        singleButton
      >
        <View className='w-full px-5 pt-3 pb-4'>
          {ingredient.sources.map((src, index) => {
            console.log('source item:', index, src, typeof src);
            return (
              <View key={index} className='flex-row items-start mb-1'>
                <Text className='text-xs text-gray-500 mr-1'>•</Text>
                <Pressable onPress={() => Linking.openURL(src)}>
                  <Text className='text-xs text-gray-500 shrink flex-wrap underline'>
                    {src}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      </DefaultModal>
    </SafeAreaView>
  );
}
