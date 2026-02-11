import { axiosInstance } from '../index';

export type CreateProductRequestPayload = {
  content: string;
};

export type CreateProductRequestResponse = {
  id: number;
  content: string;
  created_at: string;
  user: number | null;
};

export async function createProductRequest(
  payload: CreateProductRequestPayload,
) {
  const { data } = await axiosInstance.post<CreateProductRequestResponse>(
    '/products/request/', // 실제 백엔드 url에 맞게 수정
    payload,
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );

  return data;
}
