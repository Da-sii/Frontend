import GoRankingIcon from '@/assets/icons/ic_arrow_right.svg';
import LogoIcon from '@/assets/icons/ic_logo_full.svg';
import MagnifierIcon from '@/assets/icons/ic_magnifier.svg';
import BannerCarousel from '@/components/page/home/BannerCarousel';
import HomeFooter from '@/components/page/home/HomeFooter';
import ProductRankingCarousel from '@/components/page/home/ProductRankingCarousel';
import TagsView from '@/components/page/home/TagsView';
import { bannerData } from '@/constants/banner';
import { useFetchMainScreenQuery } from '@/hooks/useProductQueries';
import { router, usePathname } from 'expo-router';
import { useEffect } from 'react';

import colors from '@/constants/color';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const { data: mainScreenInfo, isLoading } = useFetchMainScreenQuery();
  const isTermsAgreed = mainScreenInfo?.user?.isTermsAgreed;
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!mainScreenInfo) return;

    // 이미 약관 화면이면 스킵(루프 방지)
    if (pathname?.includes('/terms')) return;

    // ✅ 약관 미동의인 경우에만 강제 이동
    if (isTermsAgreed === false) {
      router.replace({ pathname: '/terms', params: { mode: 'terms' } });
    }
  }, [isLoading, mainScreenInfo, isTermsAgreed, pathname]);

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top']}>
      <ScrollView className='flex-1'>
        <View className='flex-row items-center justify-between px-6 pt-4'>
          <LogoIcon width={80} height={30} />

          <View className='flex-row'>
            <View className='flex-row'>
              <Pressable
                hitSlop={8}
                onPress={() => router.push('/home/search')}
              >
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
          <View className='flex-row items-center justify-between mx-6'>
            <Text className='text-base font-n-bd'>현재 급상승 랭킹</Text>
            <Pressable
              hitSlop={8}
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/home/ranking',
                  params: { initialTab: 'daily' },
                })
              }
            >
              <GoRankingIcon />
            </Pressable>
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
