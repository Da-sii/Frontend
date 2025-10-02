// services/auth/signIn.ts
import { axiosInstance } from './index';

export type ReportReason =
  | 'IRRELEVANT'
  | 'MISMATCH'
  | 'PROMOTION'
  | 'ABUSE'
  | 'PRIVACY';

export type ReportRequest = {
  reason: ReportReason;
};

export type ReportResponse = {
  // 서버 스펙이 고정돼 있지 않을 수 있으니 확장 가능하게 둔다
  message?: string;
  detail?: string;
  success?: boolean;
  reported?: boolean;
  count?: number; // 누적 신고 수 등을 내려줄 수도 있음
};

export async function reportReview(
  reviewId: number,
  req: ReportRequest,
): Promise<ReportResponse> {
  console.log('[reportReview] POST', `/review/${reviewId}/report/`, req);
  const { data } = await axiosInstance.post<ReportResponse>(
    `/review/${reviewId}/report/`,
    req,
  );
  return data ?? {};
}
