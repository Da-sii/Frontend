export interface GetRankingPayload {
  category?: string;
  page?: number;
  period?: 'daily' | 'monthly';
}

export interface GetProductsPayload {
  bigCategory?: string;
  page?: number;
  smallCategory?: string;
  sort?: 'monthly_rank' | 'review_desc';
}

export interface SearchProductsPayload {
  word: string;
  page?: number;
  sort?: 'monthly_rank' | 'review_desc';
}

export interface UpdateNicknamePayload {
  nickname: string;
}

export interface UpdatePasswordPayload {
  current_password: string;
  new_password1: string;
  new_password2: string;
}

export interface VerifyCurrentPasswordPayload {
  current_password: string;
}
