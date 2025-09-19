import MagnifierIcon from '@/assets/icons/ic_magnifier.svg';
import CloseIcon from '@/assets/icons/ic_x.svg';
import colors from '@/constants/color';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  recentSearches?: string[];
  onRemoveRecentSearch?: (search: string) => void;
  onClearAllRecentSearches?: () => void;
}

export default function SearchBar({
  placeholder = '성분, 제품명으로 검색해보세요!',
  value,
  onChangeText,
  onFocus,
  onBlur,
  recentSearches = ['체지방 감소', '단백질 쉐이크', '단백질 셰이크'],
  onRemoveRecentSearch,
  onClearAllRecentSearches,
}: SearchBarProps) {
  return (
    <View>
      <View className='px-4'>
        <View className='flex-row items-center bg-gray-100 rounded-full px-4 py-1 pb-3 mb-4'>
          <TextInput
            className='flex-1 text-base'
            placeholder={placeholder}
            placeholderTextColor={colors.gray[400]}
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            autoFocus={true}
          />
          {value.length > 0 && (
            <Pressable
              className='ml-2 bg-gray-400 rounded-full p-1 mt-2'
              onPress={() => onChangeText('')}
            >
              <CloseIcon width={11} height={11} color={colors.gray[0]} />
            </Pressable>
          )}
          <Pressable className='ml-2 mt-2'>
            <MagnifierIcon width={20} height={20} color={colors.gray[400]} />
          </Pressable>
        </View>
      </View>

      <View className='w-full border-[0.5px] border-gray-100 mb-4' />

      <View className='px-4 mb-4'>
        {recentSearches && recentSearches.length > 0 && (
          <View>
            <View className='flex-row justify-between items-center mb-3'>
              <Text className='text-base font-semibold text-gray-900'>
                최근 검색
              </Text>
              <Pressable onPress={onClearAllRecentSearches}>
                <Text className='text-sm text-gray-500'>전체삭제</Text>
              </Pressable>
            </View>

            <FlatList
              data={recentSearches}
              horizontal
              keyExtractor={(item, index) => `${item}-${index}`}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
              contentContainerStyle={{ paddingVertical: 4 }}
              renderItem={({ item }) => (
                <View className='flex-row items-center bg-white border-[0.5px] border-gray-200 rounded-full pl-4 pr-2 py-1'>
                  <Text className='text-sm text-gray-700 mr-2'>{item}</Text>
                  <Pressable
                    onPress={() => onRemoveRecentSearch?.(item)}
                    className='p-1'
                  >
                    <CloseIcon width={16} height={16} fill={colors.gray[700]} />
                  </Pressable>
                </View>
              )}
            />
          </View>
        )}
      </View>

      {recentSearches && recentSearches.length > 0 && (
        <View className='w-full border-[0.5px] border-gray-100 mb-4' />
      )}
    </View>
  );
}
