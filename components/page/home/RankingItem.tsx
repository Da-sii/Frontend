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

interface RankingRowProps {
  item: RankingItem;
  index: number;
  onPress?: () => void;
}

const ITEM_HEIGHT = 96;

export default function RankingRow({ item, index, onPress }: RankingRowProps) {
  const bgColor = index < 3 ? colors.green[100] : '#fff';
  const badgeColor =
    index === 0
      ? colors.green[500]
      : index === 1
        ? colors.green[400]
        : index === 2
          ? colors.green[300]
          : colors.gray[300];

  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: ITEM_HEIGHT,
          paddingHorizontal: 16,
          backgroundColor: bgColor,
        }}
      >
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: badgeColor,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>{index + 1}</Text>
        </View>

        <Image
          source={item.image}
          style={{
            width: 64,
            height: 64,
            borderRadius: 8,
            marginLeft: 12,
            backgroundColor: colors.gray.box,
          }}
          resizeMode='cover'
        />

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text
            style={{ fontSize: 12, color: colors.gray[500], marginBottom: 2 }}
          >
            {item.brand}
          </Text>
          <Text
            style={{ fontSize: 14, fontWeight: '500', color: colors.gray[900] }}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: colors.yellow.star, fontSize: 12 }}>★</Text>
            <Text
              style={{ fontSize: 12, color: colors.gray[600], marginLeft: 4 }}
            >
              {item.rating} ({item.reviewCount})
            </Text>
          </View>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text
            style={{ fontSize: 14, fontWeight: '600', color: colors.gray[900] }}
          >
            {item.price}
          </Text>
          <Text style={{ fontSize: 12, color: colors.gray[500] }}>
            / {item.weight}
          </Text>
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
