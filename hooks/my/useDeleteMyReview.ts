// features/review/useDeleteReview.ts
import { deleteReview } from '@/services/my/deleteReview';
import {
  QueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

type Opts = {
  // 목록 재조회가 필요한 경우 사용 (예: 상세 페이지에서 해당 상품 리뷰 쿼리키를 쓰는 경우)
  onSuccessInvalidateKeys?: (productId: number) => (readonly unknown[])[];
  onSuccess?: (res: Awaited<ReturnType<typeof deleteReview>>) => void;
  onError?: (err: unknown) => void;
};

export function useDeleteReview(opts?: Opts) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: number) => deleteReview(reviewId),
    onMutate: async (reviewId: number) => {
      const key = ['my', 'reviews']; // 실제 키에 맞게
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueriesData<any>(
        key as QueryFilters<readonly unknown[]>,
      );
      return { prev };
    },

    onSuccess: async (res) => {
      const raw = (res as any)?.product_id;
      const productId = Number.isFinite(Number(raw)) ? Number(raw) : null;

      const defaultKeys: (readonly unknown[])[] = [
        // 제품 상세 리뷰(인피니트)
        ['product', 'reviews', productId],
        // 내 리뷰 목록
        ['my', 'reviews'],
        // 리뷰 이미지 스냅샷/모아보기
        ['review-image-list', productId],
        // 평점/통계
        ['product', 'rating-stats', productId],
      ];

      const keys = opts?.onSuccessInvalidateKeys?.(productId!) ?? defaultKeys;
      await Promise.all(keys.map((k) => qc.invalidateQueries({ queryKey: k })));
      opts?.onSuccess?.(res);
    },
    onError: (err: any) => {
      // 서버 표준 에러 메시지 우선 사용
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        (err?.response?.status === 401
          ? '로그인이 필요합니다.'
          : err?.response?.status === 403
            ? '본인 작성 리뷰만 삭제할 수 있어요.'
            : err?.response?.status === 404
              ? '해당 리뷰를 찾을 수 없어요.'
              : '리뷰 삭제 중 오류가 발생했어요.');

      opts?.onError?.(err);
    },
  });
}
