export type SmallCategory = { category: string; iconUrl: string };

export interface IProduct {
  id: number;
  name: string;
  image: string;
  company: string;
  reviewCount: string;
  reviewAvg: string;
}
export interface IRankingProduct extends IProduct {
  rankDiff?: string;
}
