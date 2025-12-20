// services/product/addProduct.ts
import { axiosInstance } from '../index';

export type IngredientPayload = {
  ingredientId: number;
  amount: string;
};

export type AddProductRequest = {
  name: string;
  company: string;
  productType?: string;
  images: string[]; // 문자열 배열
  ingredients: IngredientPayload[];
};

export type AddProductResponse = {
  id: string; // 서버에서 생성된 productId
  name: string;
};

export async function addProduct(
  payload: AddProductRequest,
): Promise<AddProductResponse> {
  // FormData로 감싸기
  const formData = new FormData();
  formData.append('name', payload.name);
  formData.append('company', payload.company);
  if (payload.productType) formData.append('productType', payload.productType);

  payload.images.forEach((img) => {
    formData.append('images', img);
  });

  formData.append('ingredients', JSON.stringify(payload.ingredients));

  const { data } = await axiosInstance.post<AddProductResponse>(
    '/products/add/',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
}
