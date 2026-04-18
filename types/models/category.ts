export interface TopProduct {
  [key: string]: unknown;
}

export type MiddleCategory = {
  category: string;
  smallCategories: string[];
};

export interface ICategory {
  category: string;
  middleCategories: MiddleCategory[];
}

export interface IRankingCategoryItem {
  bigCategory: string;
  middleCategory: string;
  smallCategory: string;
}

export interface IRankingCategory {
  topSmallCategories: IRankingCategoryItem[];
}
