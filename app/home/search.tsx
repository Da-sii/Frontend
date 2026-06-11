import SelectOptionsIcon from '@/assets/icons/ic_arrow_down.svg';
import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import ViewTypeIcon from '@/assets/icons/ic_grid.svg';
import ListTypeIcon from '@/assets/icons/ic_list.svg';
import DefaultModal from '@/components/common/modals/DefaultModal';
import Navigation from '@/components/layout/Navigation';
import ProductCard from '@/components/page/home/ProductCard';
import ProductListRow from '@/components/page/home/ProductListRow';
import SearchBar from '@/components/page/home/SearchBar';
import { SortBottomSheet } from '@/components/page/search/SortBottomSheet';
import colors from '@/constants/color';
import { useSearchProductsQuery } from '@/hooks/useProductQueries';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { useProductSelectStore } from '@/store/useProductSelectStore';
import { IProduct } from '@/types/models/product';
import BottomSheet from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 16 * 2 - 8 * 2) / 2;

export default function Search() {
  const router = useRouter();
  const { word, mode } = useLocalSearchParams<{
    word?: string;
    mode?: string;
  }>();
  const isAddMode = mode === 'add';

  const { recentSearches, add, remove, clear } = useRecentSearches();
  const setSelected = useProductSelectStore((s) => s.setSelected);

  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [inputValue, setInputValue] = useState(word ?? '');
  const [searchQuery, setSearchQuery] = useState(word ?? '');
  const [selectedSort, setSelectedSort] = useState('monthly_rank');
  const [hasSearched, setHasSearched] = useState(!!word);
  const [confirmProduct, setConfirmProduct] = useState<IProduct | null>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const {
    data: searchData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useSearchProductsQuery({
    word: searchQuery,
    sort: selectedSort as 'monthly_rank' | 'review_desc',
  });

  const flatData = useMemo(
    () => searchData?.pages.flatMap((page) => page.results) ?? [],
    [searchData],
  );

  const handleSearch = () => {
    if (inputValue.trim()) {
      setSearchQuery(inputValue);
      add(inputValue);
      setHasSearched(true);
    }
  };

  const handleRecentSearchPress = (search: string) => {
    setSearchQuery(search);
    setInputValue(search);
    setHasSearched(true);
  };

  const handleProductPress = (item: IProduct) => {
    if (isAddMode) {
      setConfirmProduct(item);
    } else {
      router.push({
        pathname: '/product/[id]/productDetail',
        params: { id: item.id },
      });
    }
  };

  const handleConfirmAdd = () => {
    if (!confirmProduct) return;
    setSelected(confirmProduct);
    setConfirmProduct(null);
    router.back();
  };

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const title = isAddMode ? '제품 추가' : hasSearched ? '검색 결과' : '검색';
  const placeholder = isAddMode
    ? '회사, 제품명으로 검색해보세요!'
    : '성분, 제품명으로 검색해보세요!';

  return (
    <SafeAreaView className='bg-white flex-1'>
      <Navigation
        title={title}
        left={<ArrowLeftIcon width={20} height={20} fill={colors.gray[900]} />}
        onLeftPress={() => router.back()}
      />

      <SearchBar
        value={inputValue}
        onChangeText={setInputValue}
        onSubmit={handleSearch}
        placeholder={placeholder}
        recentSearches={recentSearches}
        onRecentSearchPress={handleRecentSearchPress}
        onRemoveRecentSearch={remove}
        onClearAllRecentSearches={clear}
        onClearList={() => {
          setSearchQuery('');
          setHasSearched(false);
        }}
      />

      {flatData.length > 0 ? (
        <FlatList
          ListHeaderComponent={
            <View className='mb-3 mt-[-10px]'>
              <View className='flex-row justify-between items-center'>
                <Text className='text-sm text-gray-900 font-n-bd'>
                  총 {searchData?.pages[0]?.count}개
                </Text>
                <View className='flex-row items-center'>
                  <Pressable
                    className='flex-row items-center mr-2'
                    onPress={() => bottomSheetRef.current?.expand()}
                  >
                    <Text className='text-sm font-n-bd text-gray-900 mr-1'>
                      {
                        [
                          { id: 'monthly_rank', label: '랭킹순' },
                          { id: 'review_desc', label: '리뷰순' },
                        ].find((o) => o.id === selectedSort)?.label
                      }
                    </Text>
                    <SelectOptionsIcon
                      width={10}
                      height={10}
                      fill={colors.gray[900]}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      setViewType((v) => (v === 'grid' ? 'list' : 'grid'))
                    }
                  >
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
          data={flatData}
          numColumns={viewType === 'grid' ? 2 : 1}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 17, paddingTop: 8 }}
          columnWrapperStyle={
            viewType === 'grid'
              ? { justifyContent: 'space-between', marginBottom: 16 }
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
                  onPress={() => handleProductPress(item)}
                />
              </View>
            ) : (
              <ProductListRow
                item={item}
                onPress={() => handleProductPress(item)}
              />
            )
          }
          ItemSeparatorComponent={
            viewType === 'list'
              ? () => <View className='h-[0.5px] bg-gray-200' />
              : undefined
          }
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
      ) : (
        hasSearched &&
        searchQuery && (
          <View className='flex-1 items-center py-10'>
            <Text className='text-gray-400 font-medium text-center'>
              {`'${searchQuery}'에 대한\n검색 결과가 없습니다.`}
            </Text>
          </View>
        )
      )}

      <SortBottomSheet
        sheetRef={bottomSheetRef}
        selected={selectedSort}
        onSelect={(id) => {
          setSelectedSort(id);
          bottomSheetRef.current?.close();
        }}
      />

      {/* 제품 추가 확인 모달 */}
      {isAddMode && confirmProduct && (
        <DefaultModal
          visible={!!confirmProduct}
          title='해당 제품을 추가하시겠습니까?'
          confirmText='추가'
          onConfirm={handleConfirmAdd}
          onCancel={() => setConfirmProduct(null)}
        />
      )}
    </SafeAreaView>
  );
}
