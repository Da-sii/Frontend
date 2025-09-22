import SelectOptionsIcon from '@/assets/icons/ic_arrow_down.svg';
import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import CheckIcon from '@/assets/icons/ic_check.svg';
import ViewTypeIcon from '@/assets/icons/ic_grid.svg';
import ListTypeIcon from '@/assets/icons/ic_list.svg';
import Navigation from '@/components/layout/Navigation';
import ProductCard from '@/components/page/home/ProductCard';
import ProductListRow from '@/components/page/home/ProductListRow';
import SearchBar from '@/components/page/home/SearchBar';
import colors from '@/constants/color';
import { useProduct } from '@/hooks/useProduct';
import { IProduct } from '@/types/models/product';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const sortOptions = [
  { id: 'monthly_rank', label: '랭킹순' },
  { id: 'review_desc', label: '리뷰순' },
  { id: 'price_asc', label: '낮은 가격순' },
  { id: 'price_desc', label: '높은 가격순' },
];

import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_SEARCHES_KEY = '@recent_searches';
const MAX_RECENT_SEARCHES = 10;

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 16 * 2 - 8 * 2) / 2;

export default function Search() {
  const router = useRouter();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const toggleViewType = () => {
    setViewType((prev) => (prev === 'grid' ? 'list' : 'grid'));
  };
  const { fetchSearchProducts, productList } = useProduct();

  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('monthly_rank');
  const [products, setProducts] = useState<IProduct[]>([]);

  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const storedSearches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        if (storedSearches) {
          setRecentSearches(JSON.parse(storedSearches));
        }
      } catch (error) {
        console.error('Failed to load recent searches.', error);
      }
    };
    loadRecentSearches();
  }, []);

  const addRecentSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    try {
      // 기존 목록에서 중복 제거
      const newSearches = [
        searchTerm,
        ...recentSearches.filter((s) => s !== searchTerm),
      ];
      // 최대 10개로 제한
      const limitedSearches = newSearches.slice(0, MAX_RECENT_SEARCHES);

      await AsyncStorage.setItem(
        RECENT_SEARCHES_KEY,
        JSON.stringify(limitedSearches),
      );
      setRecentSearches(limitedSearches);
    } catch (error) {
      console.error('Failed to save recent search.', error);
    }
  };

  const removeRecentSearch = async (searchTerm: string) => {
    try {
      const newSearches = recentSearches.filter((s) => s !== searchTerm);
      await AsyncStorage.setItem(
        RECENT_SEARCHES_KEY,
        JSON.stringify(newSearches),
      );
      setRecentSearches(newSearches);
    } catch (error) {
      console.error('Failed to remove recent search.', error);
    }
  };

  const clearAllRecentSearches = async () => {
    try {
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
      setRecentSearches([]);
    } catch (error) {
      console.error('Failed to clear recent searches.', error);
    }
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      setSearchQuery(inputValue);
      addRecentSearch(inputValue);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setProducts([]);
      return;
    }

    fetchSearchProducts({
      word: searchQuery,
      sort: selectedSort as
        | 'monthly_rank'
        | 'price_asc'
        | 'price_desc'
        | 'review_desc',
      page: 1,
    });
  }, [searchQuery, selectedSort]);

  useEffect(() => {
    if (productList) {
      setProducts(productList);
    }
  }, [productList]);

  const renderProductItem = ({ item }: { item: IProduct }) => (
    <ProductListRow
      item={item}
      onPress={() => {
        router.push({
          pathname: '/product/[id]/productDetail',
          params: { id: item.id },
        });
      }}
    />
  );

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['40%'], []);

  const handleSortSelect = (sortId: string) => {
    setSelectedSort(sortId);
    bottomSheetRef.current?.close();
  };

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

  return (
    <SafeAreaView className='bg-white flex-1'>
      <Navigation
        title='검색 결과'
        left={<ArrowLeftIcon width={20} height={20} fill={colors.gray[900]} />}
        onLeftPress={() => router.back()}
      />

      <SearchBar
        value={inputValue}
        onChangeText={setInputValue}
        onSubmit={handleSearch}
        placeholder='성분, 제품명으로 검색해보세요!'
        recentSearches={recentSearches}
        onRemoveRecentSearch={removeRecentSearch}
        onClearAllRecentSearches={clearAllRecentSearches}
      />

      <FlatList
        ListHeaderComponent={
          <View className='py-1 mb-2'>
            <View className='flex-row justify-between items-center'>
              <Text className='text-sm text-gray-900 font-semibold'>
                총 {products.length}개
              </Text>
              <View className='flex-row items-center'>
                <Pressable
                  className='flex-row items-center mr-2'
                  onPress={() => bottomSheetRef.current?.expand()}
                >
                  <Text className='text-xs text-gray-900 mr-1'>
                    {sortOptions.find((option) => option.id === selectedSort)
                      ?.label || '랭킹순'}
                  </Text>
                  <SelectOptionsIcon
                    width={10}
                    height={10}
                    fill={colors.gray[900]}
                  />
                </Pressable>
                <Pressable onPress={toggleViewType}>
                  {viewType === 'grid' ? (
                    <ViewTypeIcon width={16} height={16} />
                  ) : (
                    <ListTypeIcon width={16} height={16} />
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        }
        key={viewType}
        data={products}
        numColumns={viewType === 'grid' ? 2 : 1}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingTop: 8,
        }}
        columnWrapperStyle={
          viewType === 'grid'
            ? {
                justifyContent: 'space-between',
                marginBottom: 16,
              }
            : undefined
        }
        renderItem={({ item }) =>
          viewType === 'grid' ? (
            <View style={{ width: cardWidth }}>
              <ProductCard
                item={item as IProduct}
                style={{ width: cardWidth }}
                imageStyle={{ width: cardWidth, height: cardWidth }}
                titleNumberOfLines={2}
                onPress={() => {
                  router.push({
                    pathname: '/product/[id]/productDetail',
                    params: { id: item.id },
                  });
                }}
              />
            </View>
          ) : (
            renderProductItem({ item })
          )
        }
        ItemSeparatorComponent={
          viewType === 'list'
            ? () => <View className='h-[0.5px] bg-gray-200 mx-4' />
            : undefined
        }
      />

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        index={-1}
        backgroundStyle={{ backgroundColor: '#fff' }}
        handleIndicatorStyle={{ backgroundColor: colors.gray[100] }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView className='flex-1 px-6 py-4 rounded-2xl'>
          <View className='space-y-2'>
            {sortOptions.map((option) => (
              <Pressable
                key={option.id}
                onPress={() => handleSortSelect(option.id)}
                className='flex-row items-center justify-between px-8 py-2'
              >
                <Text
                  className={`text-base ${
                    selectedSort === option.id
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-500 font-normal'
                  }`}
                >
                  {option.label}
                </Text>

                {selectedSort === option.id && (
                  <CheckIcon width={14} height={14} />
                )}
              </Pressable>
            ))}
          </View>

          <View className='h-8' />
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}
