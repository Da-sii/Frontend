import { create } from 'zustand';

type PasswordResetState = {
  email: string;
  verificationToken: string | null;
  setEmail: (v: string) => void;
  setVerificationToken: (v: string | null) => void;
  clear: () => void;
};

export const usePasswordReset = create<PasswordResetState>((set) => ({
  email: '',
  verificationToken: null,
  setEmail: (email) => set({ email }),
  setVerificationToken: (verificationToken) => set({ verificationToken }),
  clear: () => set({ email: '', verificationToken: null }),
}));
