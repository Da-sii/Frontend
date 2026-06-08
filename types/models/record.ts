// 나의 기록 도메인 모델
// 백엔드 미구현 상태 — services/record.ts 의 mock + AsyncStorage 가 데이터 소스.

export interface IMedicationRecord {
  id: string; // 복용 항목 식별자
  productName: string;
  startDate: string; // 'YYYY-MM-DD' — 복용 시작일
}

export interface IDailyRecord {
  date: string; // 'YYYY-MM-DD' (기본 키)
  weight: number | null; // kg
  medications: IMedicationRecord[];
}
