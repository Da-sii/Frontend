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
      renderItem={({ item }) => {
        const isActive = activeKey === item.key;
        return (
          <Pressable
            onPress={() => onChangeTab(item.key)}
            style={{ flex: undefined }}
            className={`mx-2 py-3 border-b-2 ${
              isActive ? 'border-gray-900' : 'border-transparent'
            }`}
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
        );
      }}
    />
  );
}
