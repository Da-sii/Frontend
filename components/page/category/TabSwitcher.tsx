import React from 'react';
import { FlatList, Pressable, Text } from 'react-native';

export type TabItem<T extends string> = {
  key: T;
  label: string;
};

type TabSwitcherProps<T extends string> = {
  items: TabItem<T>[];
  activeKey: T;
  onChangeTab: (key: T) => void;
};

export default function TabSwitcher<T extends string>({
  items,
  activeKey,
  onChangeTab,
}: TabSwitcherProps<T>) {
  return (
    <FlatList
      data={items}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.key.toString()}
      contentContainerStyle={{
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
      }}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onChangeTab(item.key)}
          style={{ flex: undefined }}
          className='px-2 py-3'
        >
          <Text
            className={`text-center ${
              activeKey === item.key
                ? 'text-gray-900 font-semibold'
                : 'text-gray-500 font-normal'
            }`}
          >
            {item.label}
          </Text>
        </Pressable>
      )}
    />
  );
}
