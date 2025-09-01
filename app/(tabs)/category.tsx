import ViewAllIcon from '@/assets/icons/ic_arrow_right.svg';
import Navigation from '@/components/layout/Navigation';
import React, { useState } from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mainCategories = [
  '대분류1',
  '대분류2',
  '대분류3',
  '대분류4',
  '대분류5',
  '대분류6',
  '대분류7',
];

const subCategoriesMap: Record<string, string[]> = {
  대분류1: [
    '소분류1',
    '소분류2',
    '소분류3',
    '소분류4',
    '소분류5',
    '소분류6',
    '소분류7',
    '소분류8',
    '소분류9',
  ],
  대분류2: ['소분류A', '소분류B'],
};

export default function Category() {
  const [selectedMain, setSelectedMain] = useState(mainCategories[0]);
  const [colWidth, setColWidth] = useState<number>(0);

  const onTextLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > colWidth) {
      setColWidth(w);
    }
  };
  const sidebarWidth = colWidth + 16 * 2;

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top', 'left', 'right']}>
      <Navigation title='카테고리' />

      <View className='w-full border-b-[0.5px] border-gray-200' />

      <View className='flex-1 flex-row bg-white'>
        <ScrollView
          className='flex-none border-gray-200 bg-gray-100'
          style={{
            width: sidebarWidth,
            flexGrow: 0,
            flexShrink: 0,
          }}
        >
          {mainCategories.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setSelectedMain(cat)}
              className={`items-start py-3 ${
                selectedMain === cat ? 'bg-white' : 'bg-gray-100'
              }`}
            >
              <Text
                className={`text-sm font-medium pl-6 ${
                  selectedMain === cat ? 'text-gray-900' : 'text-gray-400'
                }`}
                onLayout={onTextLayout}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View className='flex-1'>
          <View className='flex-row justify-between items-center px-4 py-3'>
            <Text className='text-lg font-semibold text-gray-900'>
              {selectedMain}
            </Text>
            <Pressable onPress={() => {}} className='flex-row items-center'>
              <Text className='text-xs text-gray-500'>전체보기</Text>
              <ViewAllIcon width={10} height={10} />
            </Pressable>
          </View>

          <FlatList
            data={subCategoriesMap[selectedMain] || []}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable className='py-3 px-4'>
                <Text className='text-sm text-gray-900'>{item}</Text>
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
