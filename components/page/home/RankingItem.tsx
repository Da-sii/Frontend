import colors from '@/constants/color';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

export interface RankingItem {
  id: string;
  image: any;
  brand: string;
  name: string;
  rating: number;
  reviewCount: string;
  price: string;
  weight: string;
  change: number;
  isNew?: boolean;
}

interface RankingItemProps {
  item: RankingItem;
  index: number;
  onPress?: () => void;
}

const ITEM_HEIGHT = 135;

export default function RankingItem({
  item,
  index,
  onPress,
}: RankingItemProps) {
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
          source={item.image}
          style={{
            width: 110,
            height: '100%',
            borderRadius: 8,
          }}
          resizeMode='contain'
        />

        {index < 3 && (
          <View
            style={{
              position: 'absolute',
              top: 12,
              left: 16,
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor:
                item.change > 0 ? colors.green[500] : colors.gray[300],
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
              {index + 1}
            </Text>
          </View>
        )}

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text
            style={{ fontSize: 12, color: colors.gray[300], marginBottom: 2 }}
          >
            {item.brand}
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
              {item.rating} ({item.reviewCount})
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
              / {item.weight}
            </Text>
          </View>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text
            style={{
              fontSize: 12,
              color: item.isNew
                ? colors.orange[500]
                : item.change > 0
                  ? colors.red[500]
                  : colors.gray[600],
              marginTop: 2,
            }}
          >
            {item.isNew
              ? 'NEW'
              : item.change > 0
                ? `▲ ${item.change}`
                : `▼ ${Math.abs(item.change)}`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
