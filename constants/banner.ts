import { IBannerDetail } from '@/types/models/main';

export const bannerData = [
  {
    id: '1',
    image: require('@/assets/images/img_banner_1.png'),
    title: `다이소 유통 다이어트 건기식${'\n'}‘가르시니아’ 전량 회수?`,
    subTitle: '건강을 지키는 다이어트 보조제 선택법',
  },
  {
    id: '2',
    image: require('@/assets/images/img_product_4.png'),
    title: '다른 배너 설명2',
    subTitle: '다른 배너 설명2',
  },
  {
    id: '3',
    image: require('@/assets/images/img_banner_1.png'),
    title: '빠른 부종 개선에 유용한 인기템3',
    subTitle: '빠른 부종 개선에 유용한 인기템3',
  },
  {
    id: '4',
    image: require('@/assets/images/img_product_4.png'),
    title: '다른 배너 설명4',
    subTitle: '다른 배너 설명4',
  },
];

export const bannerDetailData: IBannerDetail[] = [
  {
    id: '1',
    images: {
      image_1: require('@/assets/images/banner/1/b_1_1.png'),
      image_2: require('@/assets/images/banner/1/b_1_2.png'),
      image_3: require('@/assets/images/banner/1/b_1_3.png'),
      image_4: require('@/assets/images/banner/1/b_1_4.png'),
    },
  },
  {
    id: '2',
    images: {
      image_1: require('@/assets/images/banner/1/b_1_1.png'),
      image_2: require('@/assets/images/banner/1/b_1_2.png'),
      image_3: require('@/assets/images/banner/1/b_1_3.png'),
      image_4: require('@/assets/images/banner/1/b_1_4.png'),
    },
  },
];
