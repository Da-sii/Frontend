import StarIcon from '@/assets/icons/ic_star.svg';
import GrayStarIcon from '@/assets/icons/productDetail/ic_gray_star.svg';
import { View } from 'react-native';

interface StarProps {
  reviewRank: number;
  height?: number;
}

export default function ReviewStar({ reviewRank, height }: StarProps) {
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
  const renderStars = (score: number) => {
    const filled = Math.floor(score); // 소수점 버림
    const empty = 5 - filled;

    return (
      <View style={{ flexDirection: 'row' }}>
        {Array.from({ length: filled }).map((_, i) => (
          <Star key={`full-${i}`} filled={true} />
        ))}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`empty-${i}`} filled={false} />
        ))}
      </View>
    );
  };
  return <View>{renderStars(reviewRank)}</View>;
}
