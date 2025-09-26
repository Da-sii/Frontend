import { axiosInstance } from '../index';

export type EditReviewRequest = {
  rate: number; // 1~5
  review: string; // 본문
};

export type EditReviewResponse = {
  message: string;
  review_id: number;
  user_id: number;
  product_id: number;
  rate: number;
  review: string;
};

export async function editReview(reviewId: number, payload: EditReviewRequest) {
  const { data } = await axiosInstance.patch<EditReviewResponse>(
    `/review/${reviewId}/`,
    payload,
  );
  return data;
}
