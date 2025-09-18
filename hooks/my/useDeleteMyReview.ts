// features/review/useDeleteReview.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReview } from '@/services/my/deleteReview';

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
    onSuccess: async (res) => {
      // 캐시 무효화 (상품 상세에서 리뷰 쿼리키: ['product','reviews', productId] 를 쓰고 있으니 그 키 기준으로)
      const productId = Number(res?.product_id);
      const keys =
        opts?.onSuccessInvalidateKeys?.(productId) ??
        ([['product', 'reviews', productId]] as (readonly unknown[])[]);

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
      console.log('삭제실패', msg);

      opts?.onError?.(err);
    },
  });
}
