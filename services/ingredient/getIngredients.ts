import { axiosInstance } from '../index';

export type Ingredient = {
  id: number;
  ingredient_name: string;
};

export type IngredientsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Ingredient[];
};

export async function getIngredients(params?: {
  search?: string;
  page?: number;
}) {
  const query: Record<string, string | number> = {};
  if (params?.search) query.search = params.search;
  if (params?.page) query.page = params.page;

  const { data } = await axiosInstance.get<IngredientsResponse>(
    '/ingredients/guides/',
    { params: Object.keys(query).length ? query : undefined },
  );

  return data;
}
