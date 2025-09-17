import GoRankingIcon from '@/assets/icons/ic_arrow_right.svg';
import LogoIcon from '@/assets/icons/ic_logo_full.svg';
import MagnifierIcon from '@/assets/icons/ic_magnifier.svg';
import BannerCarousel from '@/components/page/home/BannerCarousel';
import ProductCarousel from '@/components/page/home/ProductCarousel';
import TagsView from '@/components/page/home/TagsView';
import AddProductButton from '@/app/product/add';
import { bannerData, categories, mockRankingData } from '@/mocks/data/home';
import { router } from 'expo-router';

import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const onViewRef = React.useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setFocusedIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <SafeAreaView className='bg-white flex-1' edges={['top', 'left', 'right']}>
      <ScrollView className='flex-1'>
        <View className='flex-row justify-between items-center px-6 py-4'>
          <LogoIcon width={80} height={30} />

          <View className='flex-row gap-4'>
            <View className='flex-row gap-4'>
              <Pressable onPress={() => router.push('/home/search')}>
                <MagnifierIcon />
              </Pressable>
            </View>
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
          <TagsView categories={categories} />
        </View>

        <View className='px-4 pb-6'>
          <View className='flex-row justify-between items-center'>
            <Text className='text-base font-semibold mb-2'>
              현재 급상승 랭킹
            </Text>
            <GoRankingIcon
              onPress={() => router.push('/(tabs)/home/ranking')}
            />
          </View>

          <ProductCarousel data={mockRankingData} />
        </View>

        <View className='px-4 pb-6'>
          <Pressable onPress={() => router.push('/auth/login')}>
            <Text className='text-base font-semibold mb-2'>
              디버깅용 로그인 이동
            </Text>
          </Pressable>
        </View>

        <AddProductButton />
      </ScrollView>
    </SafeAreaView>
  );
}
