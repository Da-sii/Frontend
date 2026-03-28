export interface TopProduct {
  [key: string]: unknown;
}

type MiddleCategory = {
  category: string;
  smallCategories: string[];
};

export interface ICategory {
  category: string;
  middleCategories: MiddleCategory[];
  smallCategories: string[];
}

export interface IRankingCategory {
  topSmallCategories: {
    bigCategory: string;
    smallCategory: string;
  }[];
}
