import {
  createProductRequest,
  CreateProductRequestPayload,
  CreateProductRequestResponse,
} from '@/services/product/createRequest';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

type Vars = CreateProductRequestPayload;

export function useCreateProductRequest(opts?: {
  onSuccess?: (data: CreateProductRequestResponse, vars: Vars) => void;
  onError?: (err: unknown, vars: Vars) => void;
}) {
  return useMutation<CreateProductRequestResponse, AxiosError, Vars>({
    mutationFn: createProductRequest,

    onSuccess: (data, vars) => {
      opts?.onSuccess?.(data, vars);
    },

    onError: (err, vars) => {
      opts?.onError?.(err, vars);
    },
  });
}
