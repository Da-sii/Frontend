import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface BannerItem {
  id: string;
  image: any;
  description: string;
}

interface BannerCarouselProps {
  data: BannerItem[];
  focusedIndex: number;
  onViewableItemsChanged: any;
  viewabilityConfig: any;
}

export default function BannerCarousel({
  data,
  focusedIndex,
  onViewableItemsChanged,
  viewabilityConfig,
}: BannerCarouselProps) {
  const scales = useRef(data.map(() => new Animated.Value(0.8))).current;
  const opacities = useRef(data.map(() => new Animated.Value(0.5))).current;

  useEffect(() => {
    scales.forEach((scale, i) => {
      Animated.timing(scale, {
        toValue: i === focusedIndex ? 1 : 0.8,
        duration: 50,
        useNativeDriver: true,
      }).start();
    });

    opacities.forEach((opacity, i) => {
      Animated.timing(opacity, {
        toValue: i === focusedIndex ? 1 : 0.5,
        duration: 50,
        useNativeDriver: true,
      }).start();
    });
  }, [focusedIndex, scales, opacities]);

  const renderBannerItem = ({
    item,
    index,
  }: {
    item: BannerItem;
    index: number;
  }) => {
    return (
      <Animated.View
        key={item.id}
        className='bg-gray-box rounded-xl overflow-hidden'
        style={{
          width: width - 32,
          height: 320,
          transform: [{ scale: scales[index] }],
          opacity: opacities[index],
          marginRight: 16,
        }}
      >
        <Image
          source={item.image}
          resizeMode='cover'
          className='w-full h-full'
        />
        <View className='absolute left-4 bottom-6'>
          <Text className='text-white text-lg font-bold'>
            {item.description}
          </Text>
        </View>
        <View className='absolute top-4 right-4 bg-black bg-opacity-40 px-2 py-1 rounded-full'>
          <Text className='text-white text-xs font-semibold'>
            {index + 1}/{data.length}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderBannerItem}
      horizontal
      pagingEnabled
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  );
}
