import BarIcon from '@/assets/icons/ic_bar.svg';
import IndexIcon from '@/assets/icons/ic_ranking_index.svg';
import EmptyImage from '@/assets/images/img_empty_images.webp';
import colors from '@/constants/color';
import { IRankingProduct } from '@/types/models/product';
import { Image, Pressable, Text, View } from 'react-native';

interface Props {
  item: IRankingProduct;
  index: number;
  showDiff?: boolean;
  onPress?: () => void;
}

const ITEM_HEIGHT = 135;

export default function RankingItem({
  item,
  index,
  onPress,
  showDiff = false,
}: Props) {
  const isValidImage = item.image !== null;

  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: ITEM_HEIGHT,
          paddingHorizontal: 16,
          backgroundColor: colors.gray[0],
        }}
        className='relative py-3'
      >
        <View className='h-full overflow-hidden rounded-2xl aspect-square bg-gray-box'>
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
            <Image
              source={EmptyImage}
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode='cover'
            />
          )}
        </View>

        <View
          style={{
            position: 'absolute',
            top: 17,
            left: 25,

            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IndexIcon
            className='absolute'
            fill={index < 3 ? colors.green[500] : colors.gray[400]}
          />
          <Text className='text-white text-xs font-semibold'>{index + 1}</Text>
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

          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text className='mr-1 text-xs'>정가</Text>
            <Text className='text-base text-gray-900 mr-1'>{item.price}원</Text>
            <Text className='text-xs text-gray-300'>/ {item.unit}</Text>
          </View>
        </View>

        {showDiff && (
          <View style={{ alignItems: 'flex-end' }} className='pr-2'>
            {Number(item.rankDiff) === 0 ? (
              <BarIcon />
            ) : (
              <Text
                style={{
                  fontSize: 12,
                  color:
                    Number(item.rankDiff) > 0
                      ? colors.blue[500]
                      : colors.red[500],
                }}
              >
                {Number(item.rankDiff) > 0
                  ? 'NEW'
                  : `▲ ${Math.abs(Number(item.rankDiff))}`}
              </Text>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}
