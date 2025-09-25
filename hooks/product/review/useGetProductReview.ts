import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  fetchProductReviews,
  ProductReview,
  ReviewSort,
} from '@/services/product/review/getReviewList';

type NumLike = number | undefined;
const PAGE_SIZE = 21;

export const productReviewsInfiniteKey = (
  productId: number,
  sort: 'time' | 'high' | 'low',
) => ['product', 'reviews', 'infinite', productId, sort] as const;
export const productReviewsPreviewKey = (
  productId: number,
  sort: 'time' | 'high' | 'low',
  limit: number,
) => ['product', 'reviews', 'preview', productId, sort, limit] as const;
/**
 * 무한스크롤 리뷰 훅
 * - 초기 cursor=0
 * - 이후에는 마지막 아이템의 review_id를 cursor로 전달
 * - 페이지 사이즈: 21
 * - sort: 'time' | 'high' | 'low'
 */
export function useProductReviewsInfinite(
  productId?: NumLike,
  sort: ReviewSort = 'high',
) {
  const idNum = typeof productId === 'number' ? productId : undefined;
  const enabled = Number.isFinite(idNum); //idNum이 유효한 숫자일 때만 쿼리 실행 가능하도록

  const q = useInfiniteQuery<ProductReview[], Error>({
    queryKey: productReviewsInfiniteKey(idNum!, sort),
    enabled, // idNum이 유효한 숫자일 때만 쿼리 실행 가능하도록
    initialPageParam: 0, // 첫 페이지 커서 = 0
    queryFn: async ({ pageParam = 0 }) => {
      try {
        const cursor = Number.isFinite(pageParam as number)
          ? (pageParam as number)
          : 0;
        const res = await fetchProductReviews(idNum!, cursor, sort);

        // 배열로 정규화
        const list = Array.isArray(res)
          ? res
          : Array.isArray((res as any)?.reviews)
            ? (res as any).reviews
            : [];

        return list;
      } catch (e) {
        console.warn('[reviews] queryFn error:', e);
        throw e;
      }
    },
    /**
     * 다음 페이지 커서 계산
     * - 최근순/별점순 상관없이 "마지막 아이템의 review_id"를 커서로 사용
     * - 마지막 페이지면(undefined) 중단
     */
    getNextPageParam: (lastPage, allPages) => {
      // lastPage가 배열이 아니면 더 없음
      // if (!Array.isArray(lastPage)) return undefined;
      console.log(
        '[getNextPageParam] lastPage len =',
        Array.isArray(lastPage) ? lastPage.length : 'N/A',
      );

      const size = lastPage?.length ?? 0;
      if (size < PAGE_SIZE) return undefined;

      // 마지막 아이템 추출 (길이 접근은 위에서 size로 한 번만)
      const lastItem = lastPage[size - 1];
      const nextCursor = Number((lastItem as any)?.review_id);
      if (!Number.isFinite(nextCursor)) return undefined;
      console.log('[getNextPageParam] nextCursor =', nextCursor);
      return nextCursor;
    },

    // 최신 유지 전략
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: true,
  });

  // 평탄화 리스트
  const items = (q.data?.pages ?? [[]]).flat();

  return { ...q, items };
}

export function useProductReviewsPreview(
  productId?: NumLike,
  sort: ReviewSort = 'time',
) {
  const idNum = typeof productId === 'string' ? Number(productId) : productId;

  return useQuery<ProductReview[], Error>({
    queryKey: productReviewsPreviewKey(idNum!, sort, 3), // ← sort 포함!
    queryFn: async () => {
      const firstPage = await fetchProductReviews(idNum!, 0, sort);
      return firstPage.slice(0, 3);
    },
    enabled: Number.isFinite(idNum),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: true,
    placeholderData: [], // 초기 깜빡임 방지
    select: (d) => d ?? [], // 방어
  });
}
