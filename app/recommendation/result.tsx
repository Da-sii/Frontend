import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import ShareIcon from '@/assets/icons/ic_graph.svg';
import HomeIcon from '@/assets/icons/ic_home.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import DefaultModal from '@/components/common/modals/DefaultModal';
import Navigation from '@/components/layout/Navigation';
import ProgressTabs from '@/components/page/recommendation/ProgressTabs';
import RecommendationResultCard from '@/components/page/recommendation/RecommendationResultCard';
import colors from '@/constants/color';
import { saveRecommendations } from '@/services/recommendation';
import { useRecommendationResult } from '@/store/useRecommendationResult';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecommendationResultPage() {
  const router = useRouter();
  const result = useRecommendationResult((state) => state.result);
  const clearResult = useRecommendationResult((state) => state.clear);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveModal, setSaveModal] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    if (!result) {
      router.replace('/recommendation' as never);
    }
  }, [result, router]);

  if (!result) return null;

  const handleRestart = () => {
    clearResult();
    router.replace('/recommendation/survey' as never);
  };

  const handleSave = async () => {
    if (isSaving || isSaved) return;

    try {
      setIsSaving(true);
      await saveRecommendations(result.recommendations);
      setIsSaved(true);
      setSaveModal('success');
    } catch {
      setSaveModal('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    const ingredientNames = result.recommendations
      .map((item) => item.ingredient_name)
      .join(', ');

    Share.share({
      message: `다시 맞춤 분석 결과: ${ingredientNames}`,
    });
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Navigation
        title='맞춤 분석'
        left={<ArrowLeftIcon width={18} height={18} fill={colors.gray[900]} />}
        onLeftPress={() => router.back()}
        right={<HomeIcon width={18} height={18} fill={colors.gray[900]} />}
        onRightPress={() => router.replace('/(tabs)/home')}
      />
      <ProgressTabs activeStep={3} />

      <ScrollView
        className='flex-1'
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 63,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* TODO: 결과 요약 문구를 RecommendationResultHeader 컴포넌트로 분리 가능 */}
        <View className='flex-row gap-[5px]'>
          <Ionicons name='checkmark' size={22} color={colors.green[500]} />
          <Text className='text-sm text-gray-900 font-n-eb'>TOP 3 추천</Text>
        </View>
        <Text className='mt-[5px] font-n-bd text-sm text-gray-600'>
          답변을 분석한 맞춤 성분 및 제품이에요.
        </Text>

        <View className='mt-[20px]'>
          {result.recommendations.map((item, index) => (
            <View
              key={item.ingredient_id}
              style={{
                marginBottom:
                  index < result.recommendations.length - 1 ? 12 : 0,
              }}
            >
              <RecommendationResultCard
                key={item.ingredient_id}
                item={item}
                rank={index + 1}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* TODO: 다른 결과 화면에서도 재사용하도록 ResultActionBar 컴포넌트로 분리 가능 */}
      <View
        className='flex-row items-center border-t border-x border-gray-100 bg-[#FFF] px-[20px] pb-[10px] pt-[20px] rounded-[12px] shadow-[0_-2px_5px_0_rgba(0,0,0,0.15)]'
        style={{
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 9,
          elevation: 5,
        }}
      >
        <Pressable
          onPress={handleShare}
          className='mr-[13px] p-[5px]'
          hitSlop={8}
        >
          <ShareIcon width={26} height={30} />
        </Pressable>
        <Pressable
          onPress={handleRestart}
          className='mr-[9px] py-[14px] flex-1 items-center justify-center rounded-[12px] border border-green-500'
        >
          <Text className='text-green-500 text-b-lg font-n-eb'>
            다시 추천 받기
          </Text>
        </Pressable>
        <View className='flex-1'>
          <LongButton
            label={isSaved ? '저장 완료' : isSaving ? '저장 중...' : '저장하기'}
            height='h-[50px]'
            disabled={isSaving}
            onPress={handleSave}
          />
        </View>
      </View>

      <DefaultModal
        visible={saveModal !== null}
        title={
          saveModal === 'success'
            ? '추천 결과를 저장했어요.'
            : '추천 결과를 저장하지 못했어요.'
        }
        message={
          saveModal === 'error' ? '잠시 후 다시 시도해주세요.' : undefined
        }
        confirmText='확인'
        singleButton
        onConfirm={() => setSaveModal(null)}
      />
    </SafeAreaView>
  );
}
