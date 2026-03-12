// services/auth/terms.ts
import { axiosInstance } from '../index';

export type TermsAgreed = {
  is_terms_agreed: boolean;
};

export async function patchTermsAgreed(req: TermsAgreed): Promise<TermsAgreed> {
  const { data } = await axiosInstance.patch<TermsAgreed>('/auth/terms/', req);
  return data;
}
