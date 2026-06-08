import { IDailyRecord } from '@/types/models/record';
import { diffDays, formatShortDate, todayKey } from './recordDate';

/** 복용 n일째 (시작일 당일 = 1일째) */
export function daysTaken(startKey: string, onKey: string): number {
  return diffDays(startKey, onKey) + 1;
}

/** 복용기간 라벨: '12.16~오늘' (조회일이 오늘) 또는 '12.16~12.20' */
export function medicationPeriodLabel(startKey: string, onKey: string): string {
  const end = onKey === todayKey() ? '오늘' : formatShortDate(onKey);
  return `${formatShortDate(startKey)}~${end}`;
}

/**
 * 감량 체중(kg). 양수 = 감량. 시작일 또는 조회일 체중이 없으면 0.
 */
export function weightLost(
  records: IDailyRecord[],
  startKey: string,
  onKey: string,
): number {
  const start = records.find((r) => r.date === startKey)?.weight;
  const on = records.find((r) => r.date === onKey)?.weight;
  if (start == null || on == null) return 0;
  return Math.round((start - on) * 10) / 10;
}
