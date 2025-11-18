import GoRankingIcon from '@/assets/icons/ic_arrow_right.svg';
import LogoIcon from '@/assets/icons/ic_logo_full.svg';
import MagnifierIcon from '@/assets/icons/ic_magnifier.svg';
import BannerCarousel from '@/components/page/home/BannerCarousel';
import HomeFooter from '@/components/page/home/HomeFooter';
import ProductRankingCarousel from '@/components/page/home/ProductRankingCarousel';
import TagsView from '@/components/page/home/TagsView';
import { useFetchMainScreenQuery } from '@/hooks/useProductQueries';

import { bannerData } from '@/constants/banner';
import { router } from 'expo-router';

import colors from '@/constants/color';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const { data: mainScreenInfo, isLoading } = useFetchMainScreenQuery();

  return (
    <SafeAreaView className='bg-white flex-1' edges={['top']}>
      <ScrollView className='flex-1'>
        <View className='flex-row justify-between items-center px-6 pt-4'>
          <LogoIcon width={80} height={30} />

          <View className='flex-row'>
            <View className='flex-row'>
              <Pressable onPress={() => router.push('/home/search')}>
                <MagnifierIcon color={colors.gray[900]} />
              </Pressable>
            </View>
          </View>
        </View>

        <View className='flex-1 w-full my-[-10px]'>
          <BannerCarousel data={bannerData} />
        </View>

        <View className='px-6 mb-2'>
          <TagsView
            categories={mainScreenInfo?.topSmallCategories || []}
            isLoading={isLoading}
          />
        </View>

        <View className='mt-2 mb-12'>
          <View className='mx-6 flex-row justify-between items-center'>
            <Text className='text-base font-n-bd'>현재 급상승 랭킹</Text>
            <GoRankingIcon
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/home/ranking',
                  params: { initialTab: 'daily' },
                })
              }
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
