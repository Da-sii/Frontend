import { create } from 'zustand';

type Draft = {
  email: string;
  password: string;
  confirmPassword: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  clear: () => void;
};

export const useSignupDraft = create<Draft>((set) => ({
  email: '',
  password: '',
  confirmPassword: '',
  setEmail: (v) => set({ email: v }),
  setPassword: (v) => set({ password: v }),
  setConfirmPassword: (v) => set({ confirmPassword: v }),
  clear: () => set({ email: '', password: '', confirmPassword: '' }),
}));
