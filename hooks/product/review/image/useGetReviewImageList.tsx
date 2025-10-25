import { fetchReviewsImagesList } from '@/services/product/review/image/getPhotoReviewList';
import { useInfiniteQuery } from '@tanstack/react-query';

const PAGE_SIZE = 21;

export const useGetReviewImageList = (
  productId: number,
  initialImageId = 0,
) => {
  const q = useInfiniteQuery({
    queryKey: ['review-image-list', productId],
    initialPageParam: initialImageId,
    queryFn: async ({ pageParam = 0 }) => {
      try {
        const cursor = Number.isFinite(pageParam as number)
          ? (pageParam as number)
          : 0;
        return await fetchReviewsImagesList(productId, cursor);
      } catch (err: any) {
        console.log('[useGetReviewImageList] error', {
          status: err?.response?.status,
          data: err?.response?.data,
        });
        throw err;
      }
    },
    getNextPageParam: (lastPage) => {
      const size = lastPage.image_urls.length ?? 0;
      if (size < PAGE_SIZE) return undefined;

      const lastItem = lastPage.image_urls[size - 1];

      const nextCursor = Number((lastItem as any)?.id);
      if (!Number.isFinite(nextCursor)) return undefined;
      return nextCursor;
    },
    enabled: !!productId,
    staleTime: 30_000, // 1분 캐싱
    gcTime: 2 * 30_000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  return q;
};
