import { create } from 'zustand';

type Account = {
  email: string;
  created_at: string | null;
  login_type?: string;
};

type FoundAccountsState = {
  phone: string;
  accounts: Account[];
  setFound: (phone: string, accounts: Account[]) => void;
  clear: () => void;
};

export const useFoundAccounts = create<FoundAccountsState>((set) => ({
  phone: '',
  accounts: [],
  setFound: (phone, accounts) => set({ phone, accounts }),
  clear: () => set({ phone: '' }),
}));
