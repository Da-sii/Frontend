/* eslint-disable @typescript-eslint/no-require-imports */
import MagnifierIcon from '@/assets/icons/ic_magnifier.svg';
import BannerCarousel from '@/components/page/home/BannerCarousel';
import ProductCarousel from '@/components/page/home/ProductCarousel';

import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const bannerData = [
  {
    id: '1',
    image: require('@/assets/images/img_product_1.png'),
    description: '빠른 부종 개선에 유용한 인기템',
  },
  {
    id: '2',
    image: require('@/assets/images/img_product_2.png'),
    description: '다른 배너 설명',
  },
];

const rankingData = [
  {
    id: '1',
    image: require('@/assets/images/img_product_1.png'),
    name: '제품명제품명제품명제품명',
    rating: 4.79,
    price: '99,999원',
  },
  {
    id: '2',
    image: require('@/assets/images/img_product_2.png'),
    name: '다른 제품명',
    rating: 4.5,
    price: '89,999원',
  },
  {
    id: '3',
    image: require('@/assets/images/img_product_3.png'),
    name: '제품3',
    rating: 4.9,
    price: '79,999원',
  },
];

export default function Home() {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const onViewRef = React.useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setFocusedIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <SafeAreaView className='bg-white flex-1'>
      <ScrollView className='flex-1'>
        <View className='flex-row justify-between items-center px-4 pt-4 pb-2'>
          <Text className='text-xl font-bold'>다시</Text>
          <View className='flex-row gap-4'>
            <Pressable>
              <MagnifierIcon />
            </Pressable>
          </View>
        </View>

        <View className='px-4'>
          <BannerCarousel
            data={bannerData}
            focusedIndex={focusedIndex}
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewConfigRef.current}
          />
        </View>

        <View className='px-4 mt-4'>
          <Text className='text-base font-semibold mb-2'>인기 카테고리</Text>
          <View className='flex-row flex-wrap gap-2 mb-3'>
            {[
              '체지방 감소',
              '에너지 소모/기초대사량 증가',
              '부종개선/체내 수분 조절',
              '탄수화물 대사 조절',
              '배변활동 개선',
              '포만감 개선',
            ].map((cat: string) => (
              <View
                key={cat}
                className='px-3 py-1 bg-gray-box text-gray-700 rounded-full'
              >
                <Text className='text-xs'>{cat}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className='px-4 pb-6'>
          <Text className='text-base font-semibold mb-2'>현재 급상승 랭킹</Text>
          <ProductCarousel data={rankingData} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
