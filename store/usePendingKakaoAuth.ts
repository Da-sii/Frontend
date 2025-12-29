import { create } from 'zustand';

interface PendingKakaoAuth {
  kakaoEmail: string;
  kakaoAccessToken: string | null;
  kakaoRefreshToken: string | null;
  setPending: (v: Omit<PendingKakaoAuth, 'setPending' | 'clear'>) => void;
  clear: () => void;
}

export const usePendingKakaoAuth = create<PendingKakaoAuth>((set) => ({
  kakaoEmail: '',
  kakaoAccessToken: null,
  kakaoRefreshToken: null,
  setPending: (v) => set(v),
  clear: () =>
    set({
      kakaoEmail: '',
      kakaoAccessToken: null,
      kakaoRefreshToken: null,
    }),
}));
