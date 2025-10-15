import { IBannerDetail } from '@/types/models/main';

export const bannerData = [
  {
    id: '1',
    image: require('@/assets/images/img_banner_1.png'),
    title: '',
    subTitle: '',
  },
  {
    id: '2',
    image: require('@/assets/images/img_banner_2.png'),
    title: '',
    subTitle: '',
  },
];

export const bannerDetailData: IBannerDetail[] = [
  {
    id: '1',
    images: [
      require('@/assets/images/banner/1/b_1_1.png'),
      require('@/assets/images/banner/1/b_1_2.png'),
      require('@/assets/images/banner/1/b_1_3.png'),
      require('@/assets/images/banner/1/b_1_4.png'),
      require('@/assets/images/banner/1/b_1_5.png'),
    ],
  },
  {
    id: '2',
    images: [
      require('@/assets/images/banner/2/b_2_1.png'),
      require('@/assets/images/banner/2/b_2_2.png'),
      require('@/assets/images/banner/2/b_2_3.png'),
      require('@/assets/images/banner/2/b_2_4.png'),
    ],
  },
];
