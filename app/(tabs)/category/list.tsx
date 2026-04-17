import {
  default as MoreIcon,
  default as SelectOptionsIcon,
} from '@/assets/icons/ic_arrow_down.svg';
import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import LessIcon from '@/assets/icons/ic_arrow_up.svg';
import CheckIcon from '@/assets/icons/ic_bold_check.svg';
import ViewTypeIcon from '@/assets/icons/ic_grid.svg';
import ListTypeIcon from '@/assets/icons/ic_list.svg';
import SearchIcon from '@/assets/icons/ic_magnifier.svg';
import SkeletonProductGridItem from '@/components/common/skeleton/ProductGridItemSkeleton';
import SkeletonRankingItem from '@/components/common/skeleton/ProductListItemSkeleton';
import Navigation from '@/components/layout/Navigation';
import TabSwitcher from '@/components/page/category/TabSwitcher';
import ProductCard from '@/components/page/home/ProductCard';
import ProductListRow from '@/components/page/home/ProductListRow';
import colors from '@/constants/color';
import { useCategory } from '@/hooks/useCategory';
import { useFetchProductsQuery } from '@/hooks/useProductQueries';
import { IProduct } from '@/types/models/product';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 16 * 2 - 8 * 2) / 2;

export default function List() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { categories, fetchCategories } = useCategory();
  const params = useLocalSearchParams<{
    main?: string;
    middle: string;
  }>();

  const [bigCategory, setBigCategory] = useState(params.main ?? '');
  const [activeSmall, setActiveSmall] = useState('전체');
  const [activeMiddle, setActiveMiddle] = useState(
    params.middle === '전체' ? '전체' : (params.middle as string),
  );

  useEffect(() => {
    if (params.main) {
      setBigCategory(params.main);
    }

    if (params.middle) {
      const middleCategory = params.middle === '전체' ? '전체' : params.middle;
      setActiveMiddle(middleCategory);
      // setTab(middleCategory);
    }
  }, [params.main, params.middle]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const bigCategories = useMemo(
    () => categories.map((cat) => cat.category),
    [categories],
  );

  const targetCategory = useMemo(() => {
    return categories.find((item) => item.category === bigCategory);
  }, [categories, bigCategory]);

  const middleCategoryNames = useMemo(() => {
    if (!targetCategory) return [];

    return targetCategory.middleCategories.map((m) => m.category);
  }, [targetCategory]);

  const smallCategories = useMemo(() => {
    if (!targetCategory || !activeMiddle) return [];

    const selectedMiddle = targetCategory.middleCategories.find(
      (m) => m.category === activeMiddle,
    );

    if (!selectedMiddle) return [];

    const names = selectedMiddle.smallCategories;
    return [...names];
  }, [targetCategory, activeMiddle]);

  const handleSmallCategoryPress = (name: string) => {
    setActiveSmall((prev) => (prev === name ? '전체' : name));
  };

  useEffect(() => {
    if (params.middle && params.middle !== '전체') {
      setActiveMiddle(params.middle);
    } else if (middleCategoryNames.length > 0) {
      // 파라미터가 없거나 '전체'라면 리스트의 첫 번째 카테고리를 선택
      setActiveMiddle(middleCategoryNames[0]);
    }
  }, [params.middle, middleCategoryNames]);

  const handleBigCategoryChange = (cat: string) => {
    if (cat !== bigCategory) {
      const newTarget = categories.find((item) => item.category === cat);
      const firstMiddle = newTarget?.middleCategories[0]?.category || '';

      setBigCategory(cat);
      setActiveMiddle(firstMiddle); // '전체' 대신 첫 번째 카테고리 설정

      router.replace({
        pathname: '/(tabs)/category/list',
        params: { main: cat, middle: firstMiddle },
      });
    }
    setTopModalVisible(false);
  };

  const sortSheetRef = useRef<BottomSheetModal>(null);

  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [selectedSort, setSelectedSort] = useState<string>('monthly_rank');
  const [isTopModalVisible, setTopModalVisible] = useState(false);

  const sortOptions = [
    { id: 'monthly_rank', label: '랭킹순' },
    { id: 'review_desc', label: '리뷰순' },
  ];

  const {
    data: productList,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useFetchProductsQuery({
    bigCategory: bigCategory,
    middleCategory: activeMiddle,
    smallCategory: activeSmall === '전체' ? '' : activeSmall,
    sort: selectedSort as 'monthly_rank' | 'review_desc',
  });

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const flatData = useMemo(
    () => productList?.pages.flatMap((page) => page.results) ?? [],
    [productList],
  );

  const snapPoints = useMemo(() => ['30%'], []);
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior='close'
      />
    ),
    [],
  );

  const openSortSheet = () => sortSheetRef.current?.present();
  const closeSortSheet = () => sortSheetRef.current?.close();
  const handleSortSelect = (id: string) => {
    setSelectedSort(id);
    closeSortSheet();
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#fff' }}
      edges={['top', 'left', 'right']}
    >
      <Navigation
        left={<ArrowLeftIcon width={20} height={20} fill={colors.gray[900]} />}
        onLeftPress={() => {
          router.back();
          setTopModalVisible(false);
        }}
        center={
          <Pressable
            onPress={() => setTopModalVisible(true)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text className='mr-1 text-lg font-n-bd'>{bigCategory} </Text>
            <MoreIcon width={13} height={13} fill={colors.gray[900]} />
          </Pressable>
        }
        right={
          <Pressable onPress={() => router.push('/home/search')}>
            <SearchIcon width={20} height={20} fill={colors.gray[900]} />
          </Pressable>
        }
      />

      <View className='mt-1 w-full border-y-[1px] border-gray-50 px-2'>
        <TabSwitcher
          items={middleCategoryNames}
          activeKey={activeMiddle}
          onChangeTab={(key) => {
            setActiveMiddle(key);
            setActiveSmall('전체');
          }}
        />
      </View>

      <View className='items-start'>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
          className='self-start mt-3'
        >
          {smallCategories.map((name) => {
            const isSelected = activeSmall === name;
            return (
              <Pressable
                key={name}
                onPress={() => handleSmallCategoryPress(name)} // 클릭 시 상태 변경
                className={`h-8 border rounded-[30px] self-start justify-center px-[18px] mr-2 ${
                  isSelected
                    ? 'border-green-500 bg-green-500'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <Text
                  className={`text-sm ${
                    isSelected
                      ? 'font-n-bd text-white'
                      : 'font-n-rg text-gray-700'
                  }`}
                >
                  {name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View className='flex-row items-center justify-between px-4 py-3 pb-1 mb-2'>
        <Text className='pt-1 text-sm text-gray-900 font-n-bd'>
          총 {productList?.pages[0]?.count}개
        </Text>
        <View className='flex-row items-center'>
          <Pressable
            className='flex-row items-center mr-2'
            onPress={openSortSheet}
          >
            <Text className='mr-1 text-sm text-gray-900 font-n-bd'>
              {sortOptions.find((opt) => opt.id === selectedSort)?.label}
            </Text>
            <SelectOptionsIcon width={10} height={10} fill={colors.gray[900]} />
          </Pressable>
          <Pressable
            onPress={() => setViewType((v) => (v === 'grid' ? 'list' : 'grid'))}
          >
            {viewType === 'grid' ? (
              <ViewTypeIcon width={16} height={16} />
            ) : (
              <ListTypeIcon width={16} height={16} />
            )}
          </Pressable>
        </View>
      </View>

      {viewType === 'grid' ? (
        isLoading ? (
          <FlatList
            key='grid'
            numColumns={2}
            data={Array.from({ length: 10 })}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
            columnWrapperStyle={{
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
            renderItem={() => (
              <SkeletonProductGridItem
                style={{ width: cardWidth }}
                imageStyle={{ width: cardWidth, height: cardWidth }}
              />
            )}
            keyExtractor={(item, idx) => idx.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View className='h-[0.5px] bg-gray-200 mx-2' />
            )}
          />
        ) : (
          <FlatList
            key='grid'
            data={flatData}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
            columnWrapperStyle={{
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
            renderItem={({ item }) => (
              <View style={{ width: cardWidth }}>
                <ProductCard
                  onPress={() => {
                    router.push({
                      pathname: '/product/[id]/productDetail',
                      params: { id: item.id },
                    });
                  }}
                  item={item as IProduct}
                  style={{ width: cardWidth }}
                  imageStyle={{ width: cardWidth, height: cardWidth }}
                  titleNumberOfLines={2}
                />
              </View>
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              isFetchingNextPage ? (
                <View style={{ paddingVertical: 20 }}>
                  <ActivityIndicator size='small' />
                </View>
              ) : null
            }
            onRefresh={refetch}
            refreshing={isRefetching}
          />
        )
      ) : isLoading ? (
        <FlatList
          data={Array.from({ length: 10 })}
          renderItem={() => <SkeletonRankingItem />}
          keyExtractor={(item, idx) => idx.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View className='h-[0.5px] bg-gray-200 mx-4' />
          )}
        />
      ) : (
        <FlatList
          key='list'
          data={flatData}
          renderItem={({ item }) => (
            <View className='px-4'>
              <ProductListRow
                item={item}
                onPress={() => {
                  router.push({
                    pathname: '/product/[id]/productDetail',
                    params: { id: item.id },
                  });
                }}
              />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View className='h-[0.5px] bg-gray-200 mx-4' />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size='small' />
              </View>
            ) : null
          }
          onRefresh={refetch}
          refreshing={isRefetching}
        />
      )}

      <Modal
        isVisible={isTopModalVisible}
        animationIn='slideInDown'
        animationOut='slideOutUp'
        backdropOpacity={0.5}
        onBackdropPress={() => setTopModalVisible(false)}
        style={{ margin: 0, justifyContent: 'flex-start' }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            paddingBottom: 24,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            }}
          >
            <Navigation
              left={
                <ArrowLeftIcon width={20} height={20} fill={colors.gray[900]} />
              }
              onLeftPress={() => {
                router.back();
                setTopModalVisible(false);
              }}
              center={
                <Pressable
                  onPress={() => setTopModalVisible(false)}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <Text className='mr-2 text-lg font-n-bd'>{bigCategory}</Text>
                  <LessIcon width={13} height={13} fill={colors.gray[900]} />
                </Pressable>
              }
              right={
                <Pressable onPress={() => router.push('/home/search')}>
                  <SearchIcon width={20} height={20} fill={colors.gray[900]} />
                </Pressable>
              }
            />
          </View>

          <View
            style={{ flexDirection: 'row', flexWrap: 'wrap' }}
            className='pt-6 mt-1'
          >
            {bigCategories.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => {
                  handleBigCategoryChange(cat);
                  setTopModalVisible(false);
                }}
                style={{
                  width: '50%',
                  alignItems: 'flex-start',
                  paddingVertical: 12,
                  paddingLeft: 30,
                }}
              >
                <Text
                  className={`text-lg font-n-bd ${
                    bigCategory === cat ? 'text-gray-900' : 'text-gray-400'
                  }`}
                  style={{ fontSize: 16, color: '#333' }}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

      <BottomSheetModal
        ref={sortSheetRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
      >
        <BottomSheetView className='flex-1 px-6 py-4 rounded-2xl'>
          <View className='pt-2 pb-10'>
            {sortOptions.map((option) => (
              <Pressable
                key={option.id}
                onPress={() => handleSortSelect(option.id)}
                className='flex-row items-center justify-between px-8 py-3'
              >
                <Text
                  className={`text-base ${
                    selectedSort === option.id
                      ? 'text-gray-900 font-n-bd'
                      : 'text-gray-400 font-n-rg'
                  }`}
                >
                  {option.label}
                </Text>
                {selectedSort === option.id && (
                  <CheckIcon width={18} height={18} />
                )}
              </Pressable>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
}
