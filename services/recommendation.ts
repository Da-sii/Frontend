import { axiosInstance } from '.';

export type RecommendationSurveyPayload = {
  goals: string[];
  age_range: string;
  gender: string;
  exercise_frequency: string;
  caffeine_sensitivity: string;
  sleep_hours: string;
  meal_regularity: string;
  alcohol_frequency: string;
  smoking_status: string;
};

export type RecommendedProduct = {
  id: number;
  name: string;
  company: string;
  thumbnail: string | null;
};

export type RecommendationItem = {
  ingredient_id: number;
  ingredient_name: string;
  intro: string;
  reason: string;
  fit_score: number;
  products: RecommendedProduct[];
};

export type RecommendationResponse = {
  count: number;
  recommendations: RecommendationItem[];
};

export async function createRecommendations(
  survey: RecommendationSurveyPayload,
): Promise<RecommendationResponse> {
  const { data } = await axiosInstance.post<RecommendationResponse>(
    '/recommendations/',
    survey,
  );
  return data;
}

export async function saveRecommendations(items: RecommendationItem[]) {
  const { data } = await axiosInstance.put('/recommendations/saved/', {
    items: items.map(({ ingredient_id, intro, reason, fit_score }) => ({
      ingredient_id,
      intro,
      reason,
      fit_score,
    })),
  });
  return data;
}
