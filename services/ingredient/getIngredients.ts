import { axiosInstance } from '../index';

export type Ingredient = {
  id: number;
  ingredient_name: string; // name → ingredient_name
};

export async function getIngredients() {
  const { data } = await axiosInstance.get<{ results: Ingredient[] }>(
    '/ingredients/guides/',
  );

  return data.results;
}
