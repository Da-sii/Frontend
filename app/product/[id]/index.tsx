import { Redirect, useLocalSearchParams } from 'expo-router';

export default function ProductIndex() {
  const { id } = useLocalSearchParams();
  return <Redirect href={`/product/${id}/productDetail`} />;
}
