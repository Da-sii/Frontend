import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createReview,
  CreateReviewRequest,
  CreateReviewResponse,
} from '@/services/product/review/creatReview';
import { Alert } from 'react-native';
import { router } from 'expo-router';

export default function useCreateReview(productId: number) {
  const qc = useQueryClient();
  return useMutation<CreateReviewResponse, any, CreateReviewRequest>({
    mutationFn: (payload) => createReview(productId, payload),
    onSuccess: async () => {
      // 리뷰 목록/상품 상세 등 관련 캐시 무효화
      qc.invalidateQueries({ queryKey: ['product', 'reviews', productId] });
      qc.invalidateQueries({ queryKey: ['product', 'detail', productId] });
      Alert.alert('리뷰 작성 완료', '소중한 리뷰가 등록되었어요!');
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
        return;
      }

      if (status === 400) {
        // 서버 유효성 메시지를 그대로 보여주면 좋아요
        Alert.alert('잘못된 요청', msg);
        return;
      }

      Alert.alert('오류', msg);
    },
  });
}
