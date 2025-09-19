import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Text,
  View,
  ViewabilityConfig,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const SIDE_PREVIEW = 32;
const ITEM_WIDTH = screenWidth - SIDE_PREVIEW * 2;
const ITEM_SPACING = 1;

interface BannerItem {
  id: string;
  image: string;
  description: string;
}

interface BannerCarouselProps {
  data: BannerItem[];
  focusedIndex: number;
  onViewableItemsChanged: any;
  viewabilityConfig: ViewabilityConfig;
}

export default function BannerCarousel({
  data,
  focusedIndex,
  onViewableItemsChanged,
  viewabilityConfig,
}: BannerCarouselProps) {
  // 포커스된 카드 애니메이션 값
  const scales = useRef(data.map(() => new Animated.Value(0.8))).current;
  const opacities = useRef(data.map(() => new Animated.Value(0.5))).current;

  useEffect(() => {
    scales.forEach((scale, i) => {
      Animated.timing(scale, {
        toValue: i === focusedIndex ? 1 : 0.8,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });
    opacities.forEach((opacity, i) => {
      Animated.timing(opacity, {
        toValue: i === focusedIndex ? 1 : 0.6,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });
  }, [focusedIndex, scales, opacities]);

  // 카드 렌더러
  const renderBannerItem = ({
    item,
    index,
  }: {
    item: BannerItem;
    index: number;
  }) => (
    <Animated.View
      key={item.id}
      className='bg-gray-box rounded-xl overflow-hidden'
      style={{
        width: ITEM_WIDTH,
        height: ITEM_WIDTH,
        marginRight: index === data.length - 1 ? 0 : ITEM_SPACING,
        transform: [{ scale: scales[index] }],
        opacity: opacities[index],
      }}
    >
      <Image
        source={{ uri: item.image }}
        resizeMode='cover'
        className='w-full h-full'
      />
      <View className='absolute left-4 bottom-6'>
        <Text className='text-white text-lg font-bold'>{item.description}</Text>
      </View>
      <View className='absolute top-4 right-4 bg-black/40 px-2 py-1 rounded-full'>
        <Text className='text-white text-xs font-semibold'>
          {index + 1}/{data.length}
        </Text>
      </View>
    </Animated.View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderBannerItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      pagingEnabled={false}
      snapToInterval={ITEM_WIDTH + ITEM_SPACING}
      decelerationRate='fast'
      snapToAlignment='center'
      contentContainerStyle={{
        paddingHorizontal: SIDE_PREVIEW,
      }}
      keyExtractor={(item) => item.id}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  );
}
