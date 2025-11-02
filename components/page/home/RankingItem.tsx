import BarIcon from '@/assets/icons/ic_bar.svg';
import IndexIcon from '@/assets/icons/ic_ranking_index.svg';
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
  const left = index > 8 ? 22 : 25;

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
        className='relative py-3 '
      >
        <View className='h-full overflow-hidden rounded-xl aspect-square bg-gray-box border border-gray-100 '>
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

        <View
          style={{
            position: 'absolute',
            top: 15,
            left: left,

            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IndexIcon
            className='absolute'
            fill={index < 3 ? colors.green[500] : colors.gray[400]}
          />
          <Text className='text-white text-sm font-semibold'>{index + 1}</Text>
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
            className='mb-1'
          >
            <Text className='text-yellow-star text-xs mr-0.5'>★</Text>
            <Text className='text-gray-500 mr-1 text-xs'>
              {item.reviewAvg || (0).toFixed(2)}
            </Text>
            <Text className='text-xs text-gray-300'>({item.reviewCount})</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text className='mr-1 text-xs'>정가</Text>
            <Text className='text-base text-gray-900 mr-1'>
              {item.price.toLocaleString('ko-KR')}원
            </Text>
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
