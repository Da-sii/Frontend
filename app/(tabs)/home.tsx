import GoRankingIcon from '@/assets/icons/ic_arrow_right.svg';
import LogoIcon from '@/assets/icons/ic_logo_full.svg';
import MagnifierIcon from '@/assets/icons/ic_magnifier.svg';
import BannerCarousel from '@/components/page/home/BannerCarousel';
import HomeFooter from '@/components/page/home/HomeFooter';
import ProductRankingCarousel from '@/components/page/home/ProductRankingCarousel';
import TagsView from '@/components/page/home/TagsView';
import { useFetchMainScreenQuery } from '@/hooks/useProductQueries';

import { bannerData } from '@/mocks/data/home';
import { router } from 'expo-router';

import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const { data: mainScreenInfo, isLoading } = useFetchMainScreenQuery();

  type ViewableItem = { index: number | null };
  type OnViewableItemsChangedProps = { viewableItems: ViewableItem[] };

  const onViewRef = React.useRef(
    ({ viewableItems }: OnViewableItemsChangedProps) => {
      if (
        viewableItems.length > 0 &&
        viewableItems[0].index !== null &&
        viewableItems[0].index !== undefined
      ) {
        setFocusedIndex(viewableItems[0].index);
      }
    },
  );

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

        <View className='px-6 mb-2 mt-6'>
          <TagsView
            categories={mainScreenInfo?.topSmallCategories || []}
            isLoading={isLoading}
          />
        </View>

        <View className='mt-2 mb-12'>
          <View className='mx-6 flex-row justify-between items-center'>
            <Text className='text-base font-semibold'>현재 급상승 랭킹</Text>
            <GoRankingIcon
              onPress={() => router.push('/(tabs)/home/ranking')}
            />
          </View>

          <ProductRankingCarousel
            data={mainScreenInfo?.topProductsToday || []}
            isLoading={isLoading}
          />
        </View>

        <HomeFooter />
      </ScrollView>
    </SafeAreaView>
  );
}
