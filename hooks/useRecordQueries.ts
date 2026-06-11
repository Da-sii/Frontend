import { recordAPI } from '@/services/record';
import {
  GetRecordsRangePayload,
  UpsertRecordPayload,
} from '@/types/payloads/record';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const recordKeys = {
  all: ['records'] as const,
  range: (p: GetRecordsRangePayload) => ['records', 'range', p] as const,
  detail: (date: string) => ['records', 'detail', date] as const,
};

export const useRecordsRangeQuery = (payload: GetRecordsRangePayload = {}) =>
  useQuery({
    queryKey: recordKeys.range(payload),
    queryFn: () => recordAPI.getRecords(payload),
  });

export const useRecordQuery = (date: string) =>
  useQuery({
    queryKey: recordKeys.detail(date),
    queryFn: () => recordAPI.getRecord(date),
    enabled: !!date,
    staleTime: 1000 * 60 * 5, // 5분
  });

export const useUpsertRecordMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpsertRecordPayload) =>
      recordAPI.upsertRecord(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: recordKeys.all }),
  });
};

export const useDeleteRecordMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (date: string) => recordAPI.deleteRecord(date),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: recordKeys.all }),
  });
};
