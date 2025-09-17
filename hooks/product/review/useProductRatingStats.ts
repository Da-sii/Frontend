// src/hooks/review/useProductRatingStats.ts
import { useQuery } from '@tanstack/react-query';
import {
  getProductRatingStats,
  ProductRatingStatsDTO,
} from '@/services/product/review/getProductRatingStats';

export type ProductRatingStats = ProductRatingStatsDTO & {
  percentages: { [star in 1 | 2 | 3 | 4 | 5]: number }; // 0~100
};

export function useProductRatingStats(productId?: number | string) {
  return useQuery<ProductRatingStats>({
    queryKey: ['product', productId, 'ratingStats'],
    enabled: !!productId,
    queryFn: async () => {
      const raw = await getProductRatingStats(productId!);
      const total = raw.total_reviews || 0;

      const percentages = {
        1: total ? Math.round((raw.rating_distribution[1] / total) * 100) : 0,
        2: total ? Math.round((raw.rating_distribution[2] / total) * 100) : 0,
        3: total ? Math.round((raw.rating_distribution[3] / total) * 100) : 0,
        4: total ? Math.round((raw.rating_distribution[4] / total) * 100) : 0,
        5: total ? Math.round((raw.rating_distribution[5] / total) * 100) : 0,
      } as const;

      return { ...raw, percentages };
    },
    staleTime: 60 * 1000, // 1분
  });
}
