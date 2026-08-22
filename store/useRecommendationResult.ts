import { RecommendationResponse } from '@/services/recommendation';
import { create } from 'zustand';

type RecommendationResultState = {
  result: RecommendationResponse | null;
  setResult: (result: RecommendationResponse) => void;
  clear: () => void;
};

export const useRecommendationResult = create<RecommendationResultState>((set) => ({
  result: null,
  setResult: (result) => set({ result }),
  clear: () => set({ result: null }),
}));
