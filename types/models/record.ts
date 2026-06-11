// 나의 기록 도메인 모델
// 백엔드 미구현 상태 — services/record.ts 의 mock + AsyncStorage 가 데이터 소스.

export interface IMedicationRecord {
  id: string;
  productName: string;
  productImage?: string;
  startDate: string;
}

export interface IDailyRecord {
  date: string; // 'YYYY-MM-DD' (기본 키)
  weight: number | null; // kg
  medications: IMedicationRecord[];
}
