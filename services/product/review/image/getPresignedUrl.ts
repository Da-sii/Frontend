import { axiosInstance } from '../../../index';
import type { PresignedItem } from '@/types/review';

export async function addReviewImage(reviewId: number, fileNames: string[]) {
  const { data } = await axiosInstance.post<{
    message: string;
    presigned_urls: PresignedItem[];
  }>(`/review/${reviewId}/images/`, { urls: fileNames });
  console.log(data);
  return data.presigned_urls; // PresignedItem[]
}
