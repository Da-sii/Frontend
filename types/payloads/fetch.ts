export interface GetRankingPayload {
  category?: string;
  page?: number;
  period?: 'daily' | 'monthly';
}

export interface GetProductsPayload {
  bigCategory?: string;
  page?: number;
  smallCategory?: string;
  sort?: 'monthly_rank' | 'price_asc' | 'price_desc' | 'review_desc';
}

export interface SearchProductsPayload {
  word: string;
  page?: number;
  sort?: 'monthly_rank' | 'price_asc' | 'price_desc' | 'review_desc';
}
