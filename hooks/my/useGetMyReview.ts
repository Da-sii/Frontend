import { getMyReviewList } from '@/services/my/getReviewList';
import { useInfiniteQuery } from '@tanstack/react-query';

const PAGE_SIZE = 21;

export function useGetMyReview(initialReviewId = 0) {
  const q = useInfiniteQuery({
    queryKey: ['my', 'reviews', initialReviewId],
    initialPageParam: initialReviewId,
    queryFn: async ({ pageParam = 0 }) => {
      try {
        const cursor = Number.isFinite(pageParam as number)
          ? (pageParam as number)
          : 0;
        return await getMyReviewList(cursor);
      } catch (err: any) {
        console.log('[useGetMyReview] error', {
          status: err?.response?.status,
          data: err?.response?.data,
        });
        throw err;
      }
    },
    getNextPageParam: (lastPage) => {
      const size = lastPage.length ?? 0;
      if (size < PAGE_SIZE) return undefined;

      const lastItem = lastPage[size - 1];
      const nextCursor = Number((lastItem as any)?.review_id);
      if (!Number.isFinite(nextCursor)) return undefined;
      console.log('[getNextPageParam] nextCursor =', nextCursor);
      return nextCursor;
    },

    staleTime: 0, // 1분 캐싱
    gcTime: 0,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  return q;
}
