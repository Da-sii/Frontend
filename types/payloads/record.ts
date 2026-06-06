import { IMedicationRecord } from '../models/record';

export interface UpsertRecordPayload {
  date: string; // 'YYYY-MM-DD'
  weight: number | null;
  medications: IMedicationRecord[];
}

export interface GetRecordsRangePayload {
  startDate?: string;
  endDate?: string;
}
