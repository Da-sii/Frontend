import { KEYS } from '@/constants/storage';
import { IDailyRecord } from '@/types/models/record';
import {
  GetRecordsRangePayload,
  UpsertRecordPayload,
} from '@/types/payloads/record';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 백엔드 미구현. 실제 API 와 동일한 형태의 서비스 레이어 —
// 추후 axiosInstance 호출로 교체하면 됨. 현재는 AsyncStorage + mock 시드.

type RecordMap = Record<string, IDailyRecord>; // date -> record

async function readAll(): Promise<RecordMap> {
  const raw = await AsyncStorage.getItem(KEYS.WEIGHT_RECORDS);
  if (raw) {
    try {
      return JSON.parse(raw) as RecordMap;
    } catch {}
  }
  return {};
}

async function writeAll(map: RecordMap): Promise<void> {
  await AsyncStorage.setItem(KEYS.WEIGHT_RECORDS, JSON.stringify(map));
}

export const recordAPI = {
  async getRecords({
    startDate,
    endDate,
  }: GetRecordsRangePayload = {}): Promise<IDailyRecord[]> {
    const map = await readAll();
    let list = Object.values(map);
    if (startDate) list = list.filter((r) => r.date >= startDate);
    if (endDate) list = list.filter((r) => r.date <= endDate);
    return list.sort((a, b) => a.date.localeCompare(b.date));
  },

  async getRecord(date: string): Promise<IDailyRecord | null> {
    const map = await readAll();
    return map[date] ?? null;
  },

  async upsertRecord(payload: UpsertRecordPayload): Promise<IDailyRecord> {
    const map = await readAll();
    const record: IDailyRecord = {
      date: payload.date,
      weight: payload.weight,
      medications: payload.medications,
    };
    map[payload.date] = record;
    await writeAll(map);
    return record;
  },

  async deleteRecord(date: string): Promise<void> {
    const map = await readAll();
    delete map[date];
    await writeAll(map);
  },
};
