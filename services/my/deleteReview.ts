import { axiosInstance } from '../index';

export type DeleteReviewResponse = {
  success: boolean;
  message: string;
  review_id: number;
  user_id: number;
  product_id: number;
};

export async function deleteReview(reviewId: number) {
  const { data } = await axiosInstance.delete<DeleteReviewResponse>(
    `/review/${reviewId}/delete/`,
  );
  return data;
}
