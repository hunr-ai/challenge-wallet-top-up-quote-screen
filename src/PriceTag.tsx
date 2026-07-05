import { Text, View } from "react-native";

import { discountLabel } from "./pricing";

export interface PriceTagProps {
  /** Regular price, in cents. */
  price: number;
  /** Optional sale price, in cents. */
  salePrice?: number;
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function PriceTag({ price, salePrice }: PriceTagProps) {
  const label = discountLabel(price, salePrice);
  const onSale = label !== null;

  return (
    <View>
      <Text testID="price">
        {onSale ? formatCents(salePrice as number) : formatCents(price)}
      </Text>
      {onSale ? <Text testID="discount">{label}</Text> : null}
    </View>
  );
}
