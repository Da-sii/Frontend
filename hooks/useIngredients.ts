import {
  getIngredientDetail,
  IngredientDetail,
} from '@/services/ingredient/getIngredientDetail';
import {
  getIngredients,
  IngredientsResponse,
} from '@/services/ingredient/getIngredients';
import { useQuery } from '@tanstack/react-query';

export function useGetIngredients(params?: {
  search?: string;
  page?: number;
}) {
  return useQuery<IngredientsResponse>({
    queryKey: ['ingredients', params?.search, params?.page],
    queryFn: () => getIngredients(params),
  });
}

export function useGetIngredientDetail(id: number | string | undefined) {
  return useQuery<IngredientDetail>({
    queryKey: ['ingredientDetail', id],
    queryFn: () => getIngredientDetail(id!),
    enabled: id != null,
  });
}
