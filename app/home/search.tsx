import SelectOptionsIcon from '@/assets/icons/ic_arrow_down.svg';
import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import ViewTypeIcon from '@/assets/icons/ic_grid.svg';
import Navigation from '@/components/layout/Navigation';

import ProductCard from '@/components/page/home/ProductCard';
import SearchBar from '@/components/page/home/SearchBar';
import colors from '@/constants/color';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  const renderProductItem = ({
    item,
  }: {
    item: (typeof mockSearchProducts)[0];
  }) => (
    <ProductCard
      item={item}
      style={{
        marginBottom: 16,
      }}
    />
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
              <Text className='text-xs text-gray-900 mr-1'>랭킹순</Text>
              <SelectOptionsIcon
                width={10}
                height={10}
                fill={colors.gray[900]}
                className='mr-2'
              />
              <ViewTypeIcon width={16} height={16} fill={colors.gray[900]} />
            </View>
          </View>
        </View>

        <View className='flex-row flex-wrap px-4'>
          {filteredProducts.map((item, index) => (
            <View
              key={item.id}
              className={`mb-4 ${index % 2 === 0 ? 'pr-1' : 'pl-1'} w-1/2`}
            >
              <ProductCard item={item} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
