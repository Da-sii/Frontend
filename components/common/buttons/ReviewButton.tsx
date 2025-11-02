import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type ReviewButtonProps = {
  count: number; // 리뷰 개수
  onPress?: () => void;
};

export const ReviewButton: React.FC<ReviewButtonProps> = ({
  count,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className='w-[90%] h-[40px] bg-white rounded-xl border border-gray-200 flex-row items-center justify-center'
    >
      <Text className='text-c1 font-n-bd text-gray-900'>
        {count.toLocaleString()}개 리뷰 전체보기
      </Text>
      <View className='ml-2'>
        <Ionicons name='chevron-forward' size={16} color='#000' />
      </View>
    </TouchableOpacity>
  );
};
