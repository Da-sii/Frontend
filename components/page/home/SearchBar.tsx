import MagnifierIcon from '@/assets/icons/ic_magnifier.svg';
import CloseIcon from '@/assets/icons/ic_x.svg';
import colors from '@/constants/color';
import { useRef, useState } from 'react';
import {
  FlatList,
  LayoutAnimation,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmit?: () => void;
  recentSearches?: string[];
  onRecentSearchPress?: (search: string) => void;
  onRemoveRecentSearch?: (search: string) => void;
  onClearAllRecentSearches?: () => void;
}

export default function SearchBar({
  placeholder = '성분, 제품명으로 검색해보세요!',
  value,
  onChangeText,
  onSubmit,
  onFocus,
  onBlur,
  recentSearches = ['체지방 감소', '단백질 쉐이크', '단백질 셰이크'],
  onRecentSearchPress,
  onRemoveRecentSearch,
  onClearAllRecentSearches,
}: SearchBarProps) {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchSubmit = () => {
    inputRef.current?.blur();
    onSubmit?.();
  };

  const handleRecentSearchPress = (search: string) => {
    inputRef.current?.blur();
    onRecentSearchPress?.(search);
  };

  return (
    <View>
      <View className='px-4'>
        <View className='flex-row items-center bg-gray-50 rounded-full py-[9px] px-[20px] mb-[15px]'>
          <TextInput
            ref={inputRef}
            className='flex-1 text-b-sm font-regular'
            placeholder={placeholder}
            placeholderTextColor={colors.gray[400]}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              setIsFocused(true);
              onFocus?.();
            }}
            onBlur={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              setIsFocused(false);
              onBlur?.();
            }}
            autoFocus={true}
          />
          {value.length > 0 && (
            <Pressable
              className='ml-2 bg-gray-400 rounded-full p-[3px]'
              onPress={() => {
                onChangeText('');
              }}
            >
              <CloseIcon width={13} height={13} color={colors.gray[0]} />
            </Pressable>
          )}
          <Pressable className='ml-4' onPress={handleSearchSubmit}>
            <MagnifierIcon
              width={18}
              height={18}
              color={value !== '' ? colors.gray[900] : colors.gray[400]}
            />
          </Pressable>
        </View>
      </View>

      <View className='w-full border-[0.5px] border-gray-100 mb-4' />

      {isFocused && recentSearches && recentSearches.length > 0 && (
        <>
          <View className='px-4 mb-4'>
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
                  <Pressable
                    onPress={() => handleRecentSearchPress(item)}
                    className='flex-row items-center bg-white border-[0.5px] border-gray-200 rounded-full pl-4 pr-2 py-1'
                  >
                    <Text
                      className='flex-1 text-sm text-gray-900'
                      numberOfLines={1}
                    >
                      {item}
                    </Text>

                    <Pressable
                      onPress={() => onRemoveRecentSearch?.(item)}
                      className='p-1 ml-2 mr-1'
                      onPressIn={(e) => e.stopPropagation()}
                    >
                      <CloseIcon
                        width={16}
                        height={16}
                        color={colors.gray[700]}
                      />
                    </Pressable>
                  </Pressable>
                )}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
}
