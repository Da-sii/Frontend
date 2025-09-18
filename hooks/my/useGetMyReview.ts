import { useQuery } from '@tanstack/react-query';
import { getMyReviewList, MyReview } from '@/services/my/getReviewList';

export function useGetMyReview() {
  return useQuery<MyReview[], Error>({
    queryKey: ['my', 'reviews'],
    queryFn: () => getMyReviewList(),
    enabled: true,
    staleTime: 1000 * 30, // 30s
  });
}
