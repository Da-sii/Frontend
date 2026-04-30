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

export interface IBannerAPIItem {
  id: number;
  image_url: string;
  detail_image_url: string;
  order: number;
}

export interface IBannerCell {
  id: string;
  image: ImageSourcePropType;
}
