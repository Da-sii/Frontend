import { useQuery } from '@tanstack/react-query';
import {
  fetchProductReviews,
  ProductReview,
} from '@/services/product/review/getReviewList';

export function useProductReviews(productId?: string | number) {
  const idNum = typeof productId === 'string' ? Number(productId) : productId;

  return useQuery<ProductReview[], Error>({
    queryKey: ['product', 'reviews', idNum],
    queryFn: () => fetchProductReviews(idNum!),
    enabled: Number.isFinite(idNum),
    // ⬇️ 캐시 있어도 매번 새로 가져오게
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: true, // RN에서는 window focus 개념이 약해서 이건 보너스 정도
  });
}
