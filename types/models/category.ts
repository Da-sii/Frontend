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

export interface IRankingCategory {
  topSmallCategories: {
    bigCategory: string;
    smallCategory: string;
  }[];
}
