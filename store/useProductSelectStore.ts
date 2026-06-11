import { IProduct } from '@/types/models/product';
import { create } from 'zustand';

interface ProductSelectStore {
  selected: IProduct | null;
  setSelected: (product: IProduct | null) => void;
}

export const useProductSelectStore = create<ProductSelectStore>((set) => ({
  selected: null,
  setSelected: (product) => set({ selected: product }),
}));
