// hooks/product/useGetThreeRandomProduct.ts
import { getThreeRandomProduct } from '@/services/product/getThreeRandomProduct';
import { useQuery } from '@tanstack/react-query';

export const useGetThreeRandomProduct = () => {
  return useQuery({
    queryKey: ['three-random-products'],
    queryFn: getThreeRandomProduct,
    staleTime: 1000 * 60 * 5, // 5분 캐시 (원하는 대로 조정 가능)
  });
};
