import EmptyImage from '@/assets/images/img_empty_images.webp';
import colors from '@/constants/color';
import { IProduct } from '@/types/models/product';
import {
  Image,
  ImageStyle,
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
}

export default function ProductCard({
  item,
  style,
  imageStyle,
  titleStyle,
  infoContainerStyle,
}: Props) {
  const isValidImage = item.image !== '';

  return (
    <View
      style={[
        { backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden' },
        style,
      ]}
    >
      {!isValidImage ? (
        <Image
          source={{ uri: item.image }}
          style={[{ width: '100%', aspectRatio: 1 }, imageStyle]}
          resizeMode='cover'
        />
      ) : (
        <Image
          source={EmptyImage}
          style={[
            { width: '100%', aspectRatio: 1, borderRadius: 8 },
            imageStyle,
          ]}
          resizeMode='cover'
        />
      )}

      <View style={[{ padding: 8 }, infoContainerStyle]}>
        <Text
          style={{ fontSize: 12, color: colors.gray[500], marginBottom: 4 }}
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
            marginBottom: 4,
          }}
        >
          <Text style={{ color: colors.yellow.star, fontSize: 12 }}>★</Text>
          <Text
            style={{ fontSize: 12, color: colors.gray[400], marginLeft: 4 }}
          >
            {item.reviewAvg} ({item.reviewCount.toString()})
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text
            style={{ fontSize: 16, fontWeight: '600', color: colors.gray[900] }}
          >
            {item.price}
          </Text>
          <Text
            style={{ fontSize: 12, color: colors.gray[400], marginLeft: 4 }}
          >
            / {item.unit}
          </Text>
        </View>
      </View>
    </View>
  );
}
