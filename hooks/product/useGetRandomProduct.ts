// hooks/product/useGetThreeRandomProduct.ts
import { getThreeRandomProduct } from '@/services/product/getThreeRandomProduct';
import { useQuery } from '@tanstack/react-query';

export const useGetThreeRandomProduct = () => {
  return useQuery({
    queryKey: ['three-random-products'],
    queryFn: getThreeRandomProduct,
  });
};
