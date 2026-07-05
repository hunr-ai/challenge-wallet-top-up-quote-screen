/**
 * discountLabel formats the badge text shown on a sale price tag.
 *
 * Requirements (see BRIEF.md):
 *  - When `salePriceCents` is a finite number with `0 <= salePriceCents < priceCents`,
 *    return the discount as `-NN%`, where
 *      NN = Math.round(((priceCents - salePriceCents) / priceCents) * 100)
 *    (note: rounded, not truncated — a 32.5% discount shows as `-33%`. Compute
 *    from the cents difference; `1 - sale/price` loses precision and rounds down).
 *  - Otherwise — no sale at all (`salePriceCents` is `undefined`/`NaN`), the sale
 *    price is equal to or higher than the regular price, or it is negative —
 *    there is no discount, so return `null`.
 *
 * TODO(candidate): the starter always returns null. Implement the rule above.
 */
export function discountLabel(
  priceCents: number,
  salePriceCents?: number,
): string | null {
  return null;
}
