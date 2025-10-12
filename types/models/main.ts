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
  title: string;
  subTitle: string;
}

export interface IBannerDetail {
  id: string;
  images: {
    image_1: ImageSourcePropType;
    image_2: ImageSourcePropType;
    image_3: ImageSourcePropType;
    image_4: ImageSourcePropType;
  };
}
