import { TopProduct } from './category';

export interface TopSmallCategory {
  smallCategory: string;
  bigCategory: string;
}

export interface MainScreenInfo {
  topSmallCategories: TopSmallCategory[];
  topProductsToday: TopProduct[];
}
