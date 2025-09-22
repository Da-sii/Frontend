import type { PresignedItem } from '@/types/review';
import { axiosInstance } from '../../../index';

export async function addReviewImage(reviewId: number, fileNames: string[]) {
  const { data } = await axiosInstance.post<{
    message: string;
    presigned_urls: PresignedItem[];
  }>(`/review/${reviewId}/images/`, { urls: fileNames });

  return data.presigned_urls;
}
