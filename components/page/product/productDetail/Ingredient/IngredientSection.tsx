import FunctionalIngredientsSection from './FunctionalIngredients';
import OtherIngredientsSection from './OtherIngredients';

export default function IngredientSection({
  product,
  onPressFunctionalInfo,
  onPressOtherInfo,
}: {
  product: any;
  onPressFunctionalInfo: () => void;
  onPressOtherInfo: () => void;
}) {
  return (
    <>
      <FunctionalIngredientsSection
        ingredients={product?.ingredients}
        onPressInfo={onPressFunctionalInfo}
      />

      <OtherIngredientsSection
        ingredients={product?.otherIngredients}
        onPressInfo={onPressOtherInfo}
      />
    </>
  );
}
