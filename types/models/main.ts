import { ImageSourcePropType } from 'react-native';
import { TopProduct } from './category';

export interface TopSmallCategory {
  smallCategory: string;
  bigCategory: string;
}

export interface MainScreenInfo {
  topSmallCategories: TopSmallCategory[];
  topProductsToday: TopProduct[];
}

export interface IBannerCell {
  id: string;
  image: ImageSourcePropType;
  imageUrl: string;
}
