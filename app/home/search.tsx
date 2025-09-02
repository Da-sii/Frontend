import SelectOptionsIcon from '@/assets/icons/ic_arrow_down.svg';
import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import CheckIcon from '@/assets/icons/ic_check.svg';
import ViewTypeIcon from '@/assets/icons/ic_grid.svg';
import ListTypeIcon from '@/assets/icons/ic_list.svg';
import Navigation from '@/components/layout/Navigation';

import ProductCard from '@/components/page/home/ProductCard';
import RankingItem from '@/components/page/home/RankingItem';
import SearchBar from '@/components/page/home/SearchBar';
import colors from '@/constants/color';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const sortOptions = [
  { id: 'ranking', label: '랭킹순' },
  { id: 'review', label: '리뷰순' },
  { id: 'price_low', label: '낮은 가격순' },
  { id: 'price_high', label: '높은 가격순' },
];

const mockSearchProducts = [
  {
    id: '1',
    image: require('@/assets/images/img_product_1.png'),
    brand: '회사명',
    name: '제품명제품명제품명제품명제품명제품명...',
    rating: 4.79,
    reviewCount: '리뷰수',
    price: '정가 99,999원',
    weight: '500g',
  },
  {
    id: '2',
    image: require('@/assets/images/img_product_1.png'),
    brand: '회사명',
    name: '제품명제품명제품명제품명제품명제품명...',
    rating: 4.79,
    reviewCount: '리뷰수',
    price: '정가 99,999원',
    weight: '500g',
  },
  {
    id: '3',
    image: require('@/assets/images/img_product_1.png'),
    brand: '회사명',
    name: '제품명제품명제품명제품명제품명제품명...',
    rating: 4.79,
    reviewCount: '리뷰수',
    price: '정가 99,999원',
    weight: '500g',
  },
  {
    id: '4',
    image: require('@/assets/images/img_product_1.png'),
    brand: '회사명',
    name: '제품명제품명제품명제품명제품명제품명...',
    rating: 4.79,
    reviewCount: '리뷰수',
    price: '정가 99,999원',
    weight: '500g',
  },
  {
    id: '5',
    image: require('@/assets/images/img_product_1.png'),
    brand: '회사명',
    name: '제품명제품명제품명제품명제품명제품명...',
    rating: 4.79,
    reviewCount: '리뷰수',
    price: '정가 99,999원',
    weight: '500g',
  },
  {
    id: '6',
    image: require('@/assets/images/img_product_1.png'),
    brand: '회사명',
    name: '제품명제품명제품명제품명제품명제품명...',
    rating: 4.79,
    reviewCount: '리뷰수',
    price: '정가 99,999원',
    weight: '500g',
  },
  {
    id: '7',
    image: require('@/assets/images/img_product_1.png'),
    brand: '회사명',
    name: '제품명제품명제품명제품명제품명제품명...',
    rating: 4.79,
    reviewCount: '리뷰수',
    price: '정가 99,999원',
    weight: '500g',
  },
  {
    id: '8',
    image: require('@/assets/images/img_product_1.png'),
    brand: '회사명',
    name: '제품명제품명제품명제품명제품명제품명...',
    rating: 4.79,
    reviewCount: '리뷰수',
    price: '정가 99,999원',
    weight: '500g',
  },
  {
    id: '9',
    image: require('@/assets/images/img_product_1.png'),
    brand: '회사명',
    name: '제품명제품명제품명제품명제품명제품명...',
    rating: 4.79,
    reviewCount: '리뷰수',
    price: '정가 99,999원',
    weight: '500g',
  },
];

export default function Search() {
  const router = useRouter();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const toggleViewType = () => {
    setViewType((prev) => (prev === 'grid' ? 'list' : 'grid'));
  };

  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(mockSearchProducts);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text === '') {
      setFilteredProducts(mockSearchProducts);
    } else {
      const filtered = mockSearchProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(text.toLowerCase()) ||
          product.brand.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredProducts(filtered);
    }
  };

  const renderProductItem = ({ item, index }: { item: any; index: number }) => (
    <RankingItem item={item} index={index} onPress={() => {}} />
  );

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['40%'], []);
  // callbacks
  //   const handleSheetChanges = useCallback((index: number) => {
  //     console.log('handleSheetChanges', index);
  //   }, []);

  const [selectedSort, setSelectedSort] = React.useState('ranking');

  const handleSortSelect = (sortId: string) => {
    setSelectedSort(sortId);
    // onSortSelect?.(sortId);
    bottomSheetRef.current?.close();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
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
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        {/* 고정 헤더 */}
        <Navigation
          title='검색 결과'
          left={
            <ArrowLeftIcon width={20} height={20} fill={colors.gray[900]} />
          }
          onLeftPress={() => router.back()}
        />

        <SearchBar
          value={searchText}
          onChangeText={handleSearch}
          placeholder='성분, 제품명으로 검색해보세요!'
        />

        <View className='px-4 py-1 mb-2'>
          <View className='flex-row justify-between items-center'>
            <Text className='text-sm text-gray-900 font-semibold'>
              총 {filteredProducts.length}개
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
                  className='mr-2'
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

        {viewType === 'grid' ? (
          <View className='flex-row flex-wrap px-4'>
            {filteredProducts.map((item, idx) => (
              <View
                key={item.id}
                className={`mb-4 ${idx % 2 === 0 ? 'pr-1' : 'pl-1'} w-1/2`}
              >
                <ProductCard item={item} />
              </View>
            ))}
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className='h-px bg-gray-200' />}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
          />
        )}
      </ScrollView>

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
