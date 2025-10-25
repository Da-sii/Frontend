import colors from '@/constants/color';
import { IProduct } from '@/types/models/product';
import { Image, Pressable, Text, View } from 'react-native';

interface Props {
  item: IProduct;
  onPress?: () => void;
}

const ITEM_HEIGHT = 135;

export default function ProductListRow({ item, onPress }: Props) {
  const isValidImage = item.image !== null;

  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: ITEM_HEIGHT,

          backgroundColor: colors.gray[0],
        }}
        className='relative py-3'
      >
        <View className='h-full overflow-hidden rounded-xl aspect-square bg-gray-box'>
          {isValidImage ? (
            <Image
              source={{ uri: item.image }}
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode='cover'
            />
          ) : (
            <View className='w-full h-full bg-white items-center justify-center border border-gray-100 rounded-xl'>
              <Text className='text-gray-500 text-xs'>상품 이미지를</Text>
              <Text className='text-gray-500 text-xs'>준비중입니다</Text>
            </View>
          )}
        </View>

        <View className='flex-1 ml-3 space-y-1'>
          <Text style={{ fontSize: 12, color: colors.gray[300] }}>
            {item.company}
          </Text>
          <Text
            style={{ fontSize: 14, fontWeight: '500', color: colors.gray[900] }}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <View
            style={{ flexDirection: 'row', alignItems: 'center' }}
            className='mb-4'
          >
            <Text className='text-yellow-star text-xs'>★</Text>
            <Text className='text-gray-500 mr-1 text-xs'>
              {item.reviewAvg || (0).toFixed(2)}
            </Text>
            <Text className='text-xs text-gray-300'>({item.reviewCount})</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
            }}
          >
            <Text
              style={{ fontSize: 13, color: colors.gray[900], marginRight: 2 }}
            >
              정가
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '400',
                color: colors.gray[900],
              }}
            >
              {item.price.toLocaleString('ko-KR')}원
            </Text>
            <Text className='text-xs text-gray-300'>/ {item.unit}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
