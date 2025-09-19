export interface IProduct {
  id: number;
  name: string;
  image: string;
  company: string;
  price: number;
  unit: string;
  piece: number;
  reviewCount: string;
  reviewAvg: string;
}
export interface IRankingProduct extends IProduct {
  rankDiff: string;
}
