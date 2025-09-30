// hooks/product/review/image/useDeleteReviewImage.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import {
  deleteReviewImage,
  DeleteReviewImageResponse,
} from '@/services/product/review/image/deleteReviewImage';

export const reviewImageListKey = (productId: number) =>
  ['review-image-list', productId] as const;

// (선택) 상품 상세의 리뷰 목록 키가 있다면 함께 무효화
export const productReviewsKey = (productId: number) =>
  ['product-reviews', productId] as const;

// 1) vars 타입에서 reviewId를 선택으로
type DeleteVars = {
  imageId: number;
  reviewId?: number; // ✅ optional
  productId?: number;
};

export function useDeleteReviewImage(opts?: {
  productId?: number;
  reviewId?: number; // ✅ 훅 옵션 기본값
  onSuccess?: () => void;
  onError?: (err: unknown) => void;
}) {
  const qc = useQueryClient();

  return useMutation<
    DeleteReviewImageResponse, // ✅ 성공 타입
    unknown, // ✅ 에러 타입
    DeleteVars // ✅ variables 타입
  >({
    mutationFn: ({ reviewId, imageId }: DeleteVars) => {
      const rid = reviewId ?? opts?.reviewId; // ✅ 기본값 사용
      if (!(typeof rid === 'number' && Number.isFinite(rid))) {
        throw new Error('reviewId required');
      }
      return deleteReviewImage(rid, imageId);
    },
    onSuccess: async (_data, vars) => {
      const pid = opts?.productId ?? vars.productId;
      if (typeof pid === 'number') {
        await qc.invalidateQueries({ queryKey: reviewImageListKey(pid) });
        await qc.invalidateQueries({ queryKey: productReviewsKey(pid) });
      }
      await qc.invalidateQueries({ queryKey: ['my', 'reviews'] });
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
