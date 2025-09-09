import StarIcon from '@/assets/icons/ic_star.svg';
import GrayStarIcon from '@/assets/icons/product/productDetail/ic_gray_star.svg';
import { Pressable, View } from 'react-native';

interface StarProps {
  reviewRank: number; // 현재 값
  height?: number; // 아이콘 크기
  editable?: boolean; // 클릭 가능 여부
  onChange?: (next: number) => void; // 값 변경 콜백
  gap?: number;
}

export default function ReviewStar({
  reviewRank,
  height = 20,
  editable = false,
  onChange,
  gap = 0.5,
}: StarProps) {
  const Star = ({
    filled,
    size = height,
  }: {
    filled: boolean;
    size?: number;
  }) => {
    return filled ? (
      <StarIcon width={size} height={size} />
    ) : (
      <GrayStarIcon width={size} height={size} />
    );
  };

  // 별점 표시용 함수
  return (
    <View style={{ flexDirection: 'row' }}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(reviewRank); // 정수 단위
        const handlePress = () => {
          if (!editable) return;
          onChange?.(i + 1); // i번째 별 클릭 -> 값은 i+1
        };
        return (
          <Pressable
            key={i}
            onPress={handlePress}
            disabled={!editable}
            hitSlop={8}
            style={{ marginRight: i !== 4 ? gap : 0 }} // 별 사이 간격
          >
            <Star filled={filled} />
          </Pressable>
        );
      })}
    </View>
  );
}
