import GoRankingIcon from '@/assets/icons/ic_arrow_right.svg';
import LogoIcon from '@/assets/icons/ic_logo_full.svg';
import MagnifierIcon from '@/assets/icons/ic_magnifier.svg';
import BannerCarousel from '@/components/page/home/BannerCarousel';
import HomeFooter from '@/components/page/home/HomeFooter';
import ProductRankingCarousel from '@/components/page/home/ProductRankingCarousel';
import TagsView from '@/components/page/home/TagsView';
import { DAISO_BIG_CATEGORY, DAISO_PREVIEW_COUNT } from '@/constants/daiso';
import { useDaisoProductsQuery } from '@/hooks/useDaisoProducts';
import {
  useFetchBannersQuery,
  useFetchMainScreenQuery,
} from '@/hooks/useProductQueries';
import { router, usePathname } from 'expo-router';
import { useEffect, useMemo } from 'react';

import colors from '@/constants/color';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const { data: mainScreenInfo, isLoading } = useFetchMainScreenQuery();
  const { data: bannersRaw = [] } = useFetchBannersQuery();
  const { data: daisoProducts = [], isLoading: isDaisoLoading } =
    useDaisoProductsQuery();
  // daisoProducts는 다이소 대분류 전체 목록이라 캐러셀에 그대로 넘기면 안 된다.
  // 페이지를 이어붙이는 과정에서 id가 겹칠 수 있어 중복 제거 후 상위 N개만 노출한다.
  const daisoPreview = useMemo(() => {
    const seen = new Set<number>();
    return daisoProducts
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .slice(0, DAISO_PREVIEW_COUNT);
  }, [daisoProducts]);

  const banners = useMemo(() => {
    const seen = new Set<number>();
    return bannersRaw
      .filter((item) => {
        if (seen.has(item.order)) return false;
        seen.add(item.order);
        return true;
      })
      .map((item) => ({
        id: String(item.order),
        image: { uri: item.image_url },
      }));
  }, [bannersRaw]);
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
          <BannerCarousel data={banners} />
        </View>

        <View className='mt-2 mb-[30px]'>
          <View className='flex-row items-center justify-between mx-6'>
            <Text className='text-lg font-n-eb'>월간 랭킹</Text>
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

          <ProductRankingCarousel // TODO: 실제 월간 랭킹 데이터 연결 필요
            data={mainScreenInfo?.topProductsToday || []}
            isLoading={isLoading}
          />
        </View>

        {(isDaisoLoading || daisoProducts.length > 0) && (
          <View className='mt-2 mb-[30px]'>
            <View className='flex-row items-center justify-between mx-6'>
              <Text className='text-lg font-n-eb'>다이소 제품</Text>
              <Pressable
                hitSlop={8}
                onPress={() =>
                  router.push({
                    pathname: '/(tabs)/category/list',
                    params: { main: DAISO_BIG_CATEGORY },
                  })
                }
              >
                <GoRankingIcon />
              </Pressable>
            </View>

            <ProductRankingCarousel
              data={daisoPreview}
              isLoading={isDaisoLoading}
              showRank={false}
            />
          </View>
        )}

        <View className='px-6 mb-8 '>
          <TagsView isLoading={isLoading} showArrow />
        </View>
        <HomeFooter />
      </ScrollView>
    </SafeAreaView>
  );
}
