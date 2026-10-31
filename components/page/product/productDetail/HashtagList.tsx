import { toHashtagName } from '@/utils/search';
import { Pressable, Text, View } from 'react-native';

type HashtagListProps = {
  hashtags?: string[];
  onPressTag: (tag: string) => void;
};

export default function HashtagList({
  hashtags,
  onPressTag,
}: HashtagListProps) {
  const tags = (hashtags ?? []).map(toHashtagName).filter(Boolean);
  if (tags.length === 0) return null;

  return (
    <View className='flex-row flex-wrap gap-x-[10px] gap-y-[6px] mt-[10px]'>
      {tags.map((tag) => (
        <Pressable key={tag} onPress={() => onPressTag(tag)} hitSlop={4}>
          <Text className='text-c1 font-n-rg text-blue-400'>#{tag}</Text>
        </Pressable>
      ))}
    </View>
  );
}
