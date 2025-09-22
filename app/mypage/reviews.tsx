// app/mypage/review.tsx
import ReviewItems from '@/components/page/product/productDetail/reviewItem'; // 실제 경로로 수정
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

interface Review {
  id: string;
  productImage: string;
  productName: string;
  rating: number;
  date: string;
  modified: boolean;
  content: string;
  photos: string[];
}

const mockReviews: Review[] = [
  {
    id: '1',
    productImage: '@/assets/images/product/product1.png',
    productName: '아모레서피',
    rating: 4,
    date: '2025.08.28',
    modified: true,
    content: '반짝거리는 창문 너머 햇살이 날 비춰 … 예쁜 날엔 널 만나러 갈게',
    photos: [
      '@/assets/images/product/product1.png',
      '@/assets/images/product/product1.png',
      '@/assets/images/product/product1.png',
    ],
  },
  {
    id: '2',
    productImage: '@/assets/images/product/product1.png',
    productName: '아모레서피',
    rating: 4,
    date: '2025.08.28',
    modified: true,
    content: '반짝거리는 창문 너머 햇살이 날 비춰 … 예쁜 날엔 널 만나러 갈게',
    photos: [
      '@/assets/images/product/product1.png',
      '@/assets/images/product/product1.png',
      '@/assets/images/product/product1.png',
    ],
  },
  {
    id: '3',
    productImage: '@/assets/images/product/product1.png',
    productName: '아모레서피',
    rating: 4,
    date: '2025.08.28',
    modified: true,
    content: '반짝거리는 창문 너머 햇살이 날 비춰 … 예쁜 날엔 널 만나러 갈게',
    photos: [
      '@/assets/images/product/product1.png',
      '@/assets/images/product/product1.png',
      '@/assets/images/product/product1.png',
    ],
  },
  {
    id: '4',
    productImage: '@/assets/images/product/product1.png',
    productName: '아모레서피',
    rating: 4,
    date: '2025.08.28',
    modified: true,
    content: '반짝거리는 창문 너머 햇살이 날 비춰 … 예쁜 날엔 널 만나러 갈게',
    photos: [
      '@/assets/images/product/product1.png',
      '@/assets/images/product/product1.png',
      '@/assets/images/product/product1.png',
    ],
  },
];

export default function MyReviews() {
  const router = useRouter();

  const convertToReviewItem = (review: Review) => ({
    id: review.id,
    name: review.productName,
    date: review.date,
    isEdited: review.modified,
    content: review.content,
    rating: review.rating,
    images: review.photos,
  });

  const renderItem = ({ item }: { item: Review }) => (
    <View className='border-b border-gray-100'>
      <ReviewItems
        reviewItem={convertToReviewItem(item)}
        isPhoto={true}
        isMore={true}
        isMyReview={true}
        id={item.id}
      />

      <View className='flex-row px-4 pb-4'>
        <TouchableOpacity
          className='p-1 px-4 border border-gray-200 rounded-full items-center'
          onPress={() => {
            // console.log('수정:', item.id);
          }}
        >
          <Text className='text-xs'>수정</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className='p-1 px-4 border border-gray-200 rounded-full ml-2 items-center'
          onPress={() => {
            // console.log('삭제:', item.id);
          }}
        >
          <Text className='text-xs'>삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className='flex-1 bg-white px-4'>
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
          <Text className='px-4 pt-4 pb-2 text-base font-medium'>
            {mockReviews.length}개의 리뷰를 작성했어요!
          </Text>
        }
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        ItemSeparatorComponent={() => (
          <View className='h-[0.5px] bg-gray-100' />
        )}
      />
    </View>
  );
}
