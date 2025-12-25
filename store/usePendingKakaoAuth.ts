import { create } from 'zustand';

interface PendingKakaoAuth {
  kakaoEmail: string | null;
  kakaoAccessToken: string | null;
  kakaoRefreshToken: string | null;
  setPending: (v: Omit<PendingKakaoAuth, 'setPending' | 'clear'>) => void;
  clear: () => void;
}

export const usePendingKakaoAuth = create<PendingKakaoAuth>((set) => ({
  kakaoEmail: null,
  kakaoAccessToken: null,
  kakaoRefreshToken: null,
  setPending: (v) => set(v),
  clear: () =>
    set({
      kakaoEmail: null,
      kakaoAccessToken: null,
      kakaoRefreshToken: null,
    }),
}));
