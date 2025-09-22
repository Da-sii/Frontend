import { IProduct, IRankingProduct } from '../models/product';

export interface RankingResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IRankingProduct[];
}

export interface ProductListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IProduct[];
}

export interface UpdateNicknameResponse {
  success: boolean;
  user_id: number;
  nickname: string;
}

export interface UpdatePasswordResponse {
  success: boolean;
  user_id: number;
  message: string;
}
