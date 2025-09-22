import { LinearGradient } from 'expo-linear-gradient';
import { ImageStyle, View, ViewStyle } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

interface Props {
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  infoContainerStyle?: ViewStyle;
}

export default function SkeletonProductGridItem({
  style,
  imageStyle,
  infoContainerStyle,
}: Props) {
  const shimmerColors = ['#E0E0E0', '#F5F5F5', '#E0E0E0'];

  return (
    <View
      style={[
        {
          marginTop: 16,
          backgroundColor: '#fff',
          borderRadius: 8,
          overflow: 'hidden',
        },
        style,
      ]}
      className='flex-1'
    >
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={[{ width: '100%', aspectRatio: 1, borderRadius: 8 }, imageStyle]}
        shimmerColors={shimmerColors}
      />

      <View style={[{ paddingVertical: 12 }, infoContainerStyle]}>
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{
            width: '70%',
            height: 12,
            borderRadius: 4,
            marginBottom: 4,
          }}
          shimmerColors={shimmerColors}
        />

        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{
            width: '95%',
            height: 14,
            borderRadius: 4,
            marginBottom: 4,
          }}
          shimmerColors={shimmerColors}
        />

        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{
            width: '50%',
            height: 12,
            borderRadius: 4,
            marginBottom: 4,
          }}
          shimmerColors={shimmerColors}
        />

        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{
            width: '40%',
            height: 16,
            borderRadius: 4,
          }}
          shimmerColors={shimmerColors}
        />
      </View>
    </View>
  );
}
