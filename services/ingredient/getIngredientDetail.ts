import { axiosInstance } from '../index';

export type IngredientDetail = {
  id: number;
  ingredient_id: string;
  name: string;
  mainIngredients: string;
  keyPoints: string | string[];
  sources: string | string[];
  productCount: string;
};

export async function getIngredientDetail(id: number | string) {
  const { data } = await axiosInstance.get<IngredientDetail>(
    `/ingredients/guides/${id}/`,
  );
  return data;
}
