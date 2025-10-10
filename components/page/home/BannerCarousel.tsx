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

const SIDE_PREVIEW = 30;
const ITEM_WIDTH = screenWidth - SIDE_PREVIEW * 2;
const ITEM_SPACING = -10;

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
  const scales = useRef(data.map(() => new Animated.Value(0.9))).current;
  const opacities = useRef(data.map(() => new Animated.Value(0.7))).current;

  useEffect(() => {
    scales.forEach((scale, i) => {
      Animated.timing(scale, {
        toValue: i === focusedIndex ? 1 : 0.9,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });
    opacities.forEach((opacity, i) => {
      Animated.timing(opacity, {
        toValue: i === focusedIndex ? 1 : 0.7,
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
          {index + 1} / {data.length}
        </Text>
      </View>
    </Animated.View>
  );

  const spacerWidth = (screenWidth - ITEM_WIDTH) / 2 - 15;

  return (
    <FlatList
      data={data}
      renderItem={renderBannerItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={ITEM_WIDTH + ITEM_SPACING}
      snapToAlignment='center'
      decelerationRate='fast'
      disableIntervalMomentum={true}
      // --- 변경된 부분 ---
      // 1. contentContainerStyle에서 paddingHorizontal 제거
      contentContainerStyle={
        {
          // paddingHorizontal: SIDE_PREVIEW, // 이 줄을 제거합니다.
        }
      }
      // 2. 리스트 시작 부분에 스페이서 추가
      ListHeaderComponent={<View style={{ width: spacerWidth }} />}
      // 3. 리스트 끝 부분에 스페이서 추가
      ListFooterComponent={<View style={{ width: spacerWidth }} />}
      keyExtractor={(item) => item.id}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  );
}
