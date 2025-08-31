import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';

interface ProductItem {
  id: string;
  image: any;
  name: string;
  rating: number;
  price: string;
}

interface ProductCarouselProps {
  data: ProductItem[];
}

export default function ProductCarousel({ data }: ProductCarouselProps) {
  const renderRankingItem = ({
    item,
    index,
  }: {
    item: ProductItem;
    index: number;
  }) => (
    <View
      key={item.id}
      className='w-36 mr-2 rounded-xl bg-white shadow p-3'
      style={{ marginLeft: index === 0 ? 0 : 8 }}
    >
      <View className='absolute top-0 left-0 bg-green-500 px-2 py-1 rounded-full mb-1 z-10'>
        <Text className='text-white text-xs font-bold'>{index + 1}</Text>
      </View>
      <Image
        source={item.image}
        resizeMode='cover'
        className='w-full h-20 rounded-lg bg-gray-box'
      />
      <Text className='text-xs mt-2 mb-1 font-medium text-gray-800'>
        {item.name}
      </Text>
      <View className='flex-row items-center gap-1 mb-1'>
        <Text className='text-yellow-star text-xs'>★</Text>
        <Text className='text-xs text-gray-600'>{item.rating} (리뷰수)</Text>
      </View>
      <Text className='text-sm text-gray-900 font-semibold'>
        정가 {item.price}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderRankingItem}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
}
