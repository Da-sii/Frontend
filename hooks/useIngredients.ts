import {
  getIngredients,
  Ingredient,
} from '@/services/ingredient/getIngredients';
import { useQuery } from '@tanstack/react-query';

export function useGetIngredients() {
  return useQuery<Ingredient[]>({
    queryKey: ['ingredient'],
    queryFn: getIngredients,
  });
}
