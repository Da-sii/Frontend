// hooks/product/review/useReportReview.ts
import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { reportReview, ReportRequest, ReportResponse } from '@/services/report';

type Vars = { reviewId: number; reason: ReportRequest['reason'] };

export function useReportReview(opts?: {
  onSuccess?: (data: ReportResponse, vars: Vars) => void;
  onError?: (err: unknown, vars: Vars) => void;
}) {
  return useMutation<ReportResponse, unknown, Vars>({
    mutationFn: async ({ reviewId, reason }) =>
      reportReview(reviewId, { reason }),
    onSuccess: (data, vars) => {
      // 서버 메시지 우선, 없으면 기본 문구
      const msg =
        data?.message ||
        data?.detail ||
        '신고가 접수되었습니다. 검토 후 조치될 예정이에요.';
      Alert.alert('신고 완료', msg);
      opts?.onSuccess?.(data, vars);
    },
    onError: (err: any, vars) => {
      // 상태/본문에 따라 사용자 친화적으로 메시지 생성
      const status = err?.response?.status;
      const body = err?.response?.data;

      let msg =
        (typeof body === 'string' && body) ||
        body?.message ||
        body?.detail ||
        '신고 처리 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.';

      // 동일 사용자 중복 신고 케이스 대비(서버가 400/409를 줄 가능성)
      if (status === 400 || status === 409) {
        // 서버가 특정 키워드를 주면 그대로 보여주고, 없으면 친절 메시지
        if (/already/i.test(msg) || /중복|이미 신고/i.test(msg)) {
          // 그대로 둠
        } else {
          msg = '이미 이 리뷰를 신고하셨어요.';
        }
      }

      Alert.alert(msg);
      opts?.onError?.(err, vars);
    },
  });
}
