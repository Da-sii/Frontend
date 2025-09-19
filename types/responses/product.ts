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
