import { getPhotoReviewDetail } from '@/services/product/review/image/getPhotoReviewDetail';
import { useQuery } from '@tanstack/react-query';

export const useGetPhotoReviewDetail = (reviewId: number) => {
  return useQuery({
    queryKey: ['review-image-detail', reviewId],
    queryFn: async () => {
      try {
        return await getPhotoReviewDetail(reviewId);
      } catch (err: any) {
        console.log('[useGetPhotoReviewDetail] error', {
          status: err?.response?.status,
          data: err?.response?.data,
        });
        throw err;
      }
    },
    enabled: !!reviewId,
    staleTime: 0,
    gcTime: 0,
  });
};
