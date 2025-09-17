// hooks/useAddProduct.ts
import { useMutation } from '@tanstack/react-query';
import {
  addProduct,
  AddProductRequest,
  AddProductResponse,
} from '@/services/product/addProduct';
import { Alert } from 'react-native';

export const useAddProduct = () =>
  useMutation<AddProductResponse, unknown, AddProductRequest>({
    mutationFn: addProduct,
    onSuccess: (data) => {
      Alert.alert('제품 등록 완료', `${data.name} 이(가) 등록되었습니다.`);
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        '제품 등록 중 오류가 발생했어요.';
      Alert.alert('실패', msg);
    },
  });
