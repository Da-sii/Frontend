import React from 'react';
import { Text, View } from 'react-native';

interface TagsViewProps {
  categories: string[];
  title?: string;
}

export default function TagsView({
  categories,
  title = '인기 카테고리',
}: TagsViewProps) {
  return (
    <View>
      <Text className='text-base font-semibold mb-2'>{title}</Text>
      <View className='flex-row flex-wrap gap-2 mb-3'>
        {categories.map((cat: string) => (
          <View
            key={cat}
            className='px-3 py-1 bg-white border-[0.5px] border-gray-100 text-gray-700 rounded-full'
          >
            <Text className='text-xs'>{cat}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
