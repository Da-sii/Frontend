import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface TagsViewProps {
  categories: string[];
  title?: string;
}

export default function TagsView({
  categories,
  title = '인기 카테고리',
}: TagsViewProps) {
  const router = useRouter();

  const handlePress = (cat: string) => {
    router.push({
      pathname: '/(tabs)/home/ranking',
      params: { category: cat },
    });
  };
  return (
    <View>
      <Text className='text-base font-semibold mb-4'>{title}</Text>
      <View className='flex-row flex-wrap gap-2 mb-3'>
        {categories.map((cat: string) => (
          <Pressable key={cat} onPress={() => handlePress(cat)}>
            <View
              key={cat}
              className='px-3 py-1 bg-white border-[0.5px] border-gray-100 text-gray-700 rounded-full'
            >
              <Text className='text-xs'>{cat}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
