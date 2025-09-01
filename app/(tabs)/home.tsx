import GoRankingIcon from '@/assets/icons/ic_arrow_right.svg';
import LogoIcon from '@/assets/icons/ic_logo_word.svg';
import MagnifierIcon from '@/assets/icons/ic_magnifier.svg';
import BannerCarousel from '@/components/page/home/BannerCarousel';
import ProductCarousel from '@/components/page/home/ProductCarousel';
import TagsView from '@/components/page/home/TagsView';

import { bannerData, categories, rankingData } from '@/mocks/data/home';

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
    <SafeAreaView className='bg-white flex-1'>
      <ScrollView className='flex-1'>
        <View className='flex-row justify-between items-center px-4 pt-4 pb-2'>
          <LogoIcon />

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
          <TagsView categories={categories} />
        </View>

        <View className='px-4 pb-6'>
          <View className='flex-row justify-between items-center'>
            <Text className='text-base font-semibold mb-2'>
              현재 급상승 랭킹
            </Text>
            <GoRankingIcon />
          </View>

          <ProductCarousel data={rankingData} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
