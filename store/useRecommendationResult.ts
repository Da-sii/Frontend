import { RecommendationResponse } from '@/services/recommendation';
import { create } from 'zustand';

type RecommendationResultState = {
  result: RecommendationResponse | null;
  isSaved: boolean;
  setResult: (result: RecommendationResponse) => void;
  setSavedResult: (result: RecommendationResponse) => void;
  markSaved: () => void;
  clear: () => void;
};

export const useRecommendationResult = create<RecommendationResultState>((set) => ({
  result: null,
  isSaved: false,
  setResult: (result) => set({ result, isSaved: false }),
  setSavedResult: (result) => set({ result, isSaved: true }),
  markSaved: () => set({ isSaved: true }),
  clear: () => set({ result: null, isSaved: false }),
}));
