import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  editReview,
  EditReviewRequest,
  EditReviewResponse,
} from '@/services/my/editReview';
import { Alert } from 'react-native';
import { router } from 'expo-router';

type Opts = {
  productId?: number | null; // 상세/리뷰 목록 키에 쓰일 상품 ID
  onSuccessInvalidateKeys?: (
    productId: number | null,
  ) => (readonly unknown[])[];
  onSuccess?: (res: EditReviewResponse) => void;
  onError?: (err: unknown) => void;
};

export default function useEditMyReview(reviewId: number, opts?: Opts) {
  const qc = useQueryClient();

  return useMutation<EditReviewResponse, any, EditReviewRequest>({
    mutationFn: (payload) => editReview(reviewId, payload),
    onSuccess: async (res) => {
      const pid =
        typeof opts?.productId === 'number' && Number.isFinite(opts.productId)
          ? (opts.productId as number)
          : null;

      // 기본 무효화 키 (프로덕트 컨텍스트가 있으면 함께 무효화)
      const defaultKeys: (readonly unknown[])[] = [
        ['my', 'reviews'],
        pid != null ? (['product', 'reviews', pid] as const) : [],
        pid != null ? (['product', 'detail', pid] as const) : [],
        pid != null ? (['product', 'rating-stats', pid] as const) : [],
      ].filter((k) => k.length > 0);

      const keys =
        opts?.onSuccessInvalidateKeys?.(pid) ??
        (defaultKeys as (readonly unknown[])[]);

      await Promise.all(keys.map((k) => qc.invalidateQueries({ queryKey: k })));

      // 필요시 콜백
      opts?.onSuccess?.(res);
      // Alert.alert('리뷰 수정 완료', '리뷰가 업데이트되었어요!');
    },
    onError: (err: any) => {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        '리뷰 작성 중 오류가 발생했어요.';

      if (status === 401) {
        Alert.alert('로그인이 필요해요', '로그인 후 다시 시도해주세요.');
        router.replace('/auth/login');
      } else if (status === 400) {
        Alert.alert('잘못된 요청', msg);
      } else {
        Alert.alert('오류', msg);
      }
    },
  });
}
