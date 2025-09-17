import { LongButton } from '@/components/common/buttons/LongButton';
import { useAddProduct } from '@/hooks/product/useAddProduct';

export default function AddProductButton() {
  const addProductMutation = useAddProduct();

  const handlePress = () => {
    addProductMutation.mutate({
      name: '뉴트리디데이다이어트스페셜올뉴',
      company: '동서바이오팜(주) 안성공장',
      price: 7300,
      unit: '51g',
      piece: 60,
      productType: 'supplement',
      images: [], // 이미지 없으니 빈 배열
      ingredients: [
        { ingredientId: 1, amount: '750mg' },
        { ingredientId: 2, amount: '4.5mg' },
        { ingredientId: 3, amount: '5mg' },
      ],
    });
  };

  return <LongButton label='제품 등록하기' onPress={handlePress} />;
}
