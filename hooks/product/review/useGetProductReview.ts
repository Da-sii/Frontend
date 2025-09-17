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
    staleTime: 1000 * 30, // 30s
  });
}
