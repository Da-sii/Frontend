import colors from '@/constants/color';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

interface Props {
  showDiff?: boolean;
}

export default function SkeletonRankingItem({ showDiff = false }: Props) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={{
          width: 110,
          height: 110,
          backgroundColor: colors.gray[200],
          borderRadius: 8,
          marginHorizontal: 16,
        }}
        shimmerColors={['#E0E0E0', '#F5F5F5', '#E0E0E0']}
      />

      <View style={{ flex: 1 }}>
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{
            width: '60%',
            height: 16,
            backgroundColor: colors.gray[200],
            borderRadius: 4,
            marginBottom: 8,
          }}
          shimmerColors={['#E0E0E0', '#F5F5F5', '#E0E0E0']}
        />
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{
            width: '90%',
            height: 20,
            backgroundColor: colors.gray[200],
            borderRadius: 4,
            marginBottom: 12,
          }}
          shimmerColors={['#E0E0E0', '#F5F5F5', '#E0E0E0']}
        />
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{
            width: '40%',
            height: 16,
            backgroundColor: colors.gray[200],
            borderRadius: 4,
          }}
          shimmerColors={['#E0E0E0', '#F5F5F5', '#E0E0E0']}
        />
      </View>

      {showDiff && (
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{
            width: 30,
            height: 20,
            borderRadius: 4,
          }}
          shimmerColors={['#E0E0E0', '#F5F5F5', '#E0E0E0']}
        />
      )}
    </View>
  );
}
