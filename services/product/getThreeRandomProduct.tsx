// 제품 상세 조회 API 서비스
import { axiosInstance } from '..';

export type ProductDetail = {
  id: number;
  name: string;
  company: string;
  image: string;
};
export type ProductDetailResponse = {
  success: boolean;
  products: ProductDetail[];
};

export async function getThreeRandomProduct(): Promise<ProductDetailResponse> {
  const { data } = await axiosInstance.get<ProductDetailResponse>(
    `/review/random-products/`,
  );
  return data;
}
