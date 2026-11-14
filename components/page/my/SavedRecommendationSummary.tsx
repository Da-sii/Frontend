import RecommendationRank1Icon from '@/assets/icons/my/ic_recommendation_rank_1.svg';
import RecommendationRank2Icon from '@/assets/icons/my/ic_recommendation_rank_2.svg';
import RecommendationRank3Icon from '@/assets/icons/my/ic_recommendation_rank_3.svg';
import { SavedRecommendation } from '@/services/recommendation';
import { Text, View } from 'react-native';

type SavedRecommendationSummaryProps = {
  recommendation: SavedRecommendation;
};

export default function SavedRecommendationSummary({
  recommendation,
}: SavedRecommendationSummaryProps) {
  const items = [...recommendation.items].sort((a, b) => a.rank - b.rank);
  // SVG 파일명과 아이콘 안의 순위 숫자가 1·2등끼리 반대로 되어 있어,
  // 저장된 추천 순서(1위 → 3위)에 맞게 표시 순서를 보정한다.
  const rankIcons = [
    RecommendationRank2Icon,
    RecommendationRank1Icon,
    RecommendationRank3Icon,
  ];

  return (
    <View className='mt-[18px] rounded-[20px] border border-gray-200 px-[20px] py-[17px]'>
      <Text className='text-gray-500 font-n-bd text-c3'>
        나에게 꼭 맞는 TOP3 성분
      </Text>
      <View className='flex-row mt-4'>
        {items.map((item, index) => {
          const RankIcon = rankIcons[index];

          return (
            <View key={item.ingredient_id} className='items-center flex-1 px-1'>
              {RankIcon && <RankIcon width={33} height={39} />}
              <Text
                className='mt-2 text-center font-n-bd text-c3 leading-[18px] text-gray-800'
                numberOfLines={2}
              >
                {item.ingredient_name}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
