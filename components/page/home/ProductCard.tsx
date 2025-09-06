import colors from '@/constants/color';
import React from 'react';
import {
  Image,
  ImageStyle,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

export interface Product {
  id: string;
  image: any;
  brand: string;
  name: string;
  rating: number;
  reviewCount: string;
  price: string;
  weight: string;
}

interface ProductCardProps {
  item: Product;
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
  titleNumberOfLines = 2,
  infoContainerStyle,
}: ProductCardProps) {
  return (
    <View
      style={[
        { backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden' },
        style,
      ]}
    >
      <Image
        source={item.image}
        style={[{ width: '100%', aspectRatio: 1 }, imageStyle]}
        resizeMode='cover'
      />

      <View style={[{ padding: 8 }, infoContainerStyle]}>
        <Text
          style={{ fontSize: 12, color: colors.gray[500], marginBottom: 4 }}
        >
          {item.brand}
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
            {item.rating} ({item.reviewCount})
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
            / {item.weight}
          </Text>
        </View>
      </View>
    </View>
  );
}
