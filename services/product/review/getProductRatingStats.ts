import { axiosInstance } from '../../index';

export type RatingDistribution = {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
};

export type ProductRatingStatsDTO = {
  success: boolean;
  product_id: number;
  total_reviews: number;
  average_rating: number;
  rating_distribution: RatingDistribution;
};

export async function getProductRatingStats(
  productId: number | string,
): Promise<ProductRatingStatsDTO> {
  const { data } = await axiosInstance.get<ProductRatingStatsDTO>(
    `/review/product/${productId}/rating/`,
  );
  return data;
}
