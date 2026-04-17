import { FlatList, Pressable, Text } from 'react-native';

export type TabItem<T extends string> = {
  key: T;
  label: string;
};

type TabSwitcherProp = {
  items: string[];
  activeKey: string;
  onChangeTab: (key: string) => void;
};

export default function TabSwitcher({
  items,
  activeKey,
  onChangeTab,
}: TabSwitcherProp) {
  return (
    <FlatList
      data={items}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.toString()}
      renderItem={({ item }) => {
        const isActive = activeKey === item;
        return (
          <Pressable
            onPress={() => onChangeTab(item)}
            style={{ flex: undefined }}
            className={`mx-1 py-3 border-b-2 px-1.5 ${
              isActive ? 'border-gray-900' : 'border-transparent'
            }`}
          >
            <Text
              className={`text-center ${
                activeKey === item
                  ? 'text-gray-900 font-n-bd'
                  : 'text-gray-500 font-n-rg'
              }`}
            >
              {item}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}
