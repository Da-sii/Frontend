import { axiosInstance } from '../../index';

export type CreateReviewRequest = {
  rate: number; // 1~5
  review: string; // 본문
};

export type CreateReviewResponse = {
  message: string;
  review_id: number;
  user_id: number;
  product_id: number;
  rate: number;
  review: string;
};

export async function createReview(
  productId: number,
  payload: CreateReviewRequest,
) {
  const { data } = await axiosInstance.post<CreateReviewResponse>(
    `/review/product/${productId}/`,
    payload,
    { headers: { 'Content-Type': 'application/json' } },
  );
  return data;
}
