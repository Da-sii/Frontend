// app/mypage/review.tsx
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Review {
  id: string;
  productImage: string;
  productName: string;
  rating: number; // 별점 (1~5)
  date: string; // 작성/수정 날짜
  modified: boolean; // 수정 여부
  content: string; // 리뷰 본문
  photos: string[]; // 첨부 사진들
}

const mockReviews: Review[] = [
  {
    id: '1',
    productImage: 'https://via.placeholder.com/60',
    productName: '아모레서피',
    rating: 4,
    date: '2025.08.28',
    modified: true,
    content: '반짝거리는 창문 너머 햇살이 날 비춰 … 예쁜 날엔 널 만나러 갈게',
    photos: [
      'https://via.placeholder.com/80',
      'https://via.placeholder.com/80',
      'https://via.placeholder.com/80',
      'https://via.placeholder.com/80',
    ],
  },
  // 더미 리뷰 추가 가능
];

export default function MyReviews() {
  const router = useRouter();

  const renderStars = (count: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= count ? 'star' : 'star-outline'}
          size={16}
          color={i <= count ? '#F5A623' : '#CCC'}
          style={{ marginRight: 2 }}
        />,
      );
    }
    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
  };

  const renderItem = ({ item }: { item: Review }) => (
    <View className='py-4 border-b border-gray-100 px-4'>
      <View className='flex-row items-center mb-2'>
        <Image
          source={{ uri: item.productImage }}
          style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text className='text-base font-medium'>{item.productName}</Text>
          <View className='flex-row items-center mt-1'>
            {renderStars(item.rating)}
            <Text className='text-sm text-gray-500 ml-4'>
              {item.date}
              {item.modified ? ' 수정됨' : ''}
            </Text>
          </View>
        </View>
      </View>

      <Text className='text-sm text-gray-800 mb-2'>{item.content}</Text>

      {item.photos.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className='mb-4'
        >
          {item.photos.map((uri, idx) => (
            <Image
              key={idx}
              source={{ uri }}
              style={{ width: 80, height: 80, borderRadius: 8, marginRight: 8 }}
            />
          ))}
        </ScrollView>
      )}

      <View className='flex-row'>
        <TouchableOpacity className='flex-1 py-2 border border-gray-300 rounded-md mr-2 items-center'>
          <Text className='text-base'>수정</Text>
        </TouchableOpacity>
        <TouchableOpacity className='flex-1 py-2 border border-gray-300 rounded-md ml-2 items-center'>
          <Text className='text-base'>삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen
        options={{
          headerTitle: '내가 쓴 리뷰',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className='px-4'>
              <Ionicons name='chevron-back' size={24} color='#333' />
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />

      <FlatList
        data={mockReviews}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Text className='px-4 pt-4 text-base font-medium'>
            {mockReviews.length}개의 리뷰를 작성했어요!
          </Text>
        }
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}
