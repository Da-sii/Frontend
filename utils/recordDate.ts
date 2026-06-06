// 나의 기록 전용 날짜 유틸 (모두 'YYYY-MM-DD' 키 기반, 로컬 타임존)

export const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

const pad = (n: number): string => String(n).padStart(2, '0');

export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function addDaysKey(key: string, n: number): string {
  const d = parseDateKey(key);
  d.setDate(d.getDate() + n);
  return toDateKey(d);
}

/** endKey 를 포함한 직전 n일의 키 배열 (오름차순) */
export function recentDayKeys(n: number, endKey: string = todayKey()): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(addDaysKey(endKey, -i));
  return out;
}

/** centerKey 를 가운데(index 3)에 둔 7일 배열 */
export function weekStripKeys(centerKey: string = todayKey()): string[] {
  const out: string[] = [];
  for (let i = -3; i <= 3; i++) out.push(addDaysKey(centerKey, i));
  return out;
}

export function weekdayLabel(key: string): string {
  return WEEKDAYS[parseDateKey(key).getDay()];
}

export function dayNumber(key: string): number {
  return parseDateKey(key).getDate();
}

/** '12월 8일 (월)' */
export function formatKoreanDate(key: string): string {
  const d = parseDateKey(key);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS[d.getDay()]})`;
}

/** '12.16' */
export function formatShortDate(key: string): string {
  const d = parseDateKey(key);
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

/** toKey - fromKey (일 단위) */
export function diffDays(fromKey: string, toKey: string): number {
  const a = parseDateKey(fromKey).getTime();
  const b = parseDateKey(toKey).getTime();
  return Math.round((b - a) / 86_400_000);
}
