export interface TopProduct {
  [key: string]: unknown;
}

export interface ICategory {
  category: string;
  smallCategories: string[];
}

export interface IRankingCategory {
  topSmallCategories: {
    bigCategory: string;
    smallCategory: string;
  }[];
}
