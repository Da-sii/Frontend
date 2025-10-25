// services/product/review/image/deleteReviewImage.tsx
import { axiosInstance } from '../../../index'; // 경로는 서비스 폴더 구조에 맞춰 조정

export type DeleteReviewImageResponse = {
  message: string; // "이미지가 성공적으로 삭제되었습니다."
  image_id: number; // 삭제된 이미지 ID
  filename: string; // 삭제된 파일 경로 (예: "1/1/uuid.jpg")
};

/**
 * 리뷰 이미지 삭제 (S3 파일까지 삭제)
 * DELETE /review/{review_id}/images/{image_id}/
 */
export async function deleteReviewImage(
  reviewId: number,
  imageId: number,
): Promise<DeleteReviewImageResponse> {
  const { data } = await axiosInstance.delete<DeleteReviewImageResponse>(
    `/review/${reviewId}/images/${imageId}/`,
  );
  return data;
}
