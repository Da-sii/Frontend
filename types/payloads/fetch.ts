export interface GetRankingPayload {
  category?: string;
  page?: number;
  period?: 'daily' | 'monthly';
}

export interface GetProductsPayload {
  bigCategory?: string;
  middleCategory?: string;
  page?: number;
  smallCategory?: string;
  sort?: 'monthly_rank' | 'review_desc';
}

export interface SearchProductsPayload {
  word?: string;
  // 해시태그 검색('#' 없이 이름만). 전달 시 서버에서 word는 무시된다.
  tag?: string;
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
