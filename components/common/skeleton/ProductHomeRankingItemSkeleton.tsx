import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, View } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

const cardWidth = Dimensions.get('window').width / 3;

export default function ProductHomeRankingItemSkeleton({
  index,
}: {
  index: number;
}) {
  return (
    <View
      className='mr-1 rounded-xl bg-white py-3 max-w-[144px]'
      style={{ width: cardWidth, marginLeft: index === 0 ? 0 : 8 }}
    >
      {/* 이미지 스켈레톤 */}
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={{ width: '100%', aspectRatio: 1, borderRadius: 12 }}
      />
      {/* 텍스트 라인 스켈레톤 */}
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={{ width: '60%', height: 12, borderRadius: 4, marginTop: 5 }}
      />
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={{ width: '90%', height: 14, borderRadius: 4, marginTop: 4 }}
      />
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={{
          width: '70%',
          height: 12,
          borderRadius: 4,
          marginTop: 4,
          marginBottom: 8,
        }}
      />
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={{ width: '50%', height: 16, borderRadius: 4 }}
      />
    </View>
  );
}
