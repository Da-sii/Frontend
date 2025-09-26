// hooks/product/review/image/useDeleteReviewImage.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { deleteReviewImage } from '@/services/product/review/image/deleteReviewImage';



export const reviewImageListKey = (productId: number) =>
  ['review-image-list', productId] as const;

// (선택) 상품 상세의 리뷰 목록 키가 있다면 함께 무효화
export const productReviewsKey = (productId: number) =>
  ['product-reviews', productId] as const;

type DeleteVars = {
  reviewId: number;
  imageId: number;
  productId?: number; // 무효화 타겟이 되는 productId가 있다면 넘겨주기
};

export function useDeleteReviewImage(opts?: {
  /** invalidate 대상이 되는 productId(선택). mutate 시 vars로 넘겨도 됨 */
  productId?: number;
  onSuccess?: () => void;
  onError?: (err: unknown) => void;
}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, imageId }: DeleteVars) =>
      deleteReviewImage(reviewId, imageId),

    // 성공 시 관련 캐시 무효화
    onSuccess: async (_data, vars) => {
      const pid = opts?.productId ?? vars.productId;
      if (typeof pid === 'number') {
        await qc.invalidateQueries({ queryKey: reviewImageListKey(pid) });
        await qc.invalidateQueries({ queryKey: productReviewsKey(pid) });
      } else {
        // productId를 모르면 안전하게 관련 화면에서 수동 리패치 유도 or 광범위 무효화
        await qc.invalidateQueries();
      }
      opts?.onSuccess?.();
    },

    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        '이미지 삭제 중 오류가 발생했어요.';
      Alert.alert('삭제 실패', msg);
      opts?.onError?.(err);
    },
  });
}
