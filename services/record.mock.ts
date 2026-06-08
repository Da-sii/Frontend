import { IDailyRecord, IMedicationRecord } from '@/types/models/record';
import { addDaysKey, todayKey } from '@/utils/recordDate';

// 백엔드 미구현 — 최초 실행 시 AsyncStorage 에 시드되는 mock 기록.
// 오늘은 비워두어 "오늘 기록을 기다리고 있어요" 상태를 바로 확인할 수 있게 한다.

interface SeedProduct {
  id: string;
  name: string;
  startOffset: number; // 며칠 전부터 복용 시작했는지
}

const SEED_PRODUCTS: SeedProduct[] = [
  { id: 'p-multivitamin', name: '종합비타민', startOffset: 20 },
  { id: 'p-omega3', name: '오메가3', startOffset: 12 },
  { id: 'p-probiotics', name: '유산균', startOffset: 6 },
];

const SEED_DAYS = 30;

function buildSeed(): Record<string, IDailyRecord> {
  const today = todayKey();
  const map: Record<string, IDailyRecord> = {};

  // dayOffset: 1(어제) ~ SEED_DAYS(가장 오래된 날). 오늘(0)은 제외.
  for (let dayOffset = SEED_DAYS; dayOffset >= 1; dayOffset--) {
    const date = addDaysKey(today, -dayOffset);

    // 53kg → 50kg 로 완만히 감량 + 약간의 진폭
    const trend = 53 - (SEED_DAYS - dayOffset) * 0.1;
    const wobble = Math.sin(dayOffset / 2) * 0.3;
    const weight = Math.round((trend + wobble) * 10) / 10;

    const medications: IMedicationRecord[] = SEED_PRODUCTS.filter(
      (p) => dayOffset <= p.startOffset,
    ).map((p) => ({
      id: p.id,
      productName: p.name,
      startDate: addDaysKey(today, -p.startOffset),
    }));

    map[date] = { date, weight, medications };
  }

  return map;
}

export const MOCK_RECORDS: Record<string, IDailyRecord> = buildSeed();
