// hooks/auth/useFindIDWithPhone.ts
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  findIDWithPhone,
  findIDWithPhoneResponse,
} from '@/services/auth/findIDWithPhone';

type Options = {
  enabled?: boolean;
  onSuccess?: (data: findIDWithPhoneResponse) => void;
  onError?: (err: unknown) => void;
};

/**
 * 휴대폰 번호로 계정 찾기 훅 (TanStack Query v5)
 * - v5는 useQuery 옵션에 onSuccess/onError가 없어서 useEffect로 처리합니다.
 */

export const useFindIDWithPhone = (phone_number: string, opts?: Options) => {
  const query = useQuery<findIDWithPhoneResponse, unknown>({
    queryKey: ['findIDWithPhone', phone_number],
    queryFn: () => findIDWithPhone(phone_number),
    enabled: opts?.enabled ?? Boolean(phone_number),
  });

  // 성공 시 콜백
  useEffect(() => {
    if (query.isSuccess && query.data && opts?.onSuccess) {
      opts.onSuccess(query.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.isSuccess, query.data]);

  // 에러 시 콜백
  useEffect(() => {
    if (query.isError && query.error && opts?.onError) {
      opts.onError(query.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.isError, query.error]);

  return query;
};
