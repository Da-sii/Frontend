import colors from '@/constants/color';
import { IProduct } from '@/types/models/product';
import { Image, Pressable, Text, View } from 'react-native';

interface Props {
  item: IProduct;
  onPress?: () => void;
}

const ITEM_HEIGHT = 135;

export default function ProductListRow({ item, onPress }: Props) {
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
        className='relative'
      >
        <Image
          source={{ uri: item.image }}
          style={{
            width: 110,
            height: '100%',
            borderRadius: 8,
          }}
          resizeMode='contain'
        />

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text
            style={{ fontSize: 12, color: colors.gray[300], marginBottom: 2 }}
          >
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
            <Text style={{ color: colors.yellow.star, fontSize: 12 }}>★</Text>
            <Text
              style={{ fontSize: 12, color: colors.gray[500], marginLeft: 4 }}
            >
              {item.reviewAvg} ({item.reviewCount.toString()})
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.gray[900],
              }}
            >
              {item.price}
            </Text>
            <Text style={{ fontSize: 12, color: colors.gray[300] }}>
              / {item.unit}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
