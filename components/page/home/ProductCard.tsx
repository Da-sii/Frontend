import colors from '@/constants/color';
import { IProduct } from '@/types/models/product';
import {
  Image,
  ImageStyle,
  Pressable,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

interface Props {
  item: IProduct;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  titleStyle?: TextStyle;
  titleNumberOfLines?: number;
  infoContainerStyle?: ViewStyle;
  onPress?: () => void;
}

export default function ProductCard({
  item,
  style,
  imageStyle,
  titleStyle,
  infoContainerStyle,
  onPress,
}: Props) {
  const isValidImage = item.image !== '';

  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          { backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden' },
          style,
        ]}
      >
        {isValidImage ? (
          <Image
            source={{ uri: item.image }}
            style={[{ width: '100%', aspectRatio: 1 }, imageStyle]}
            resizeMode='cover'
          />
        ) : (
          <View
            className='w-full h-full bg-white items-center justify-center border border-gray-100 rounded-lg'
            style={[{ aspectRatio: 1 }, imageStyle]}
          >
            <Text className='text-gray-500 text-xs'>
              상품 이미지를 준비중입니다
            </Text>
          </View>
        )}

        <View style={[{ padding: 4, paddingTop: 6 }, infoContainerStyle]}>
          <Text
            style={{
              fontSize: 12,
              color: colors.gray[400],
              marginBottom: 4,
              fontWeight: '400',
            }}
          >
            {item.company}
          </Text>

          <Text
            numberOfLines={1}
            style={[
              {
                fontSize: 14,
                fontWeight: '500',
                color: colors.gray[900],
                marginBottom: 4,
              },
              titleStyle,
            ]}
          >
            {item.name}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 6,
            }}
          >
            <Text style={{ color: colors.yellow.star, fontSize: 12 }}>★</Text>
            <Text
              style={{ fontSize: 10, color: colors.gray[500], marginLeft: 2 }}
            >
              {item.reviewAvg || (0).toFixed(2)}
            </Text>
            <Text
              style={{ fontSize: 10, color: colors.gray[400], marginLeft: 2 }}
            >
              ({item.reviewCount.toString()})
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
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
            <Text
              style={{ fontSize: 11, color: colors.gray[400], marginLeft: 4 }}
            >
              / {item.unit}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
