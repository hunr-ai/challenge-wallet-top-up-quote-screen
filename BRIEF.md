# Sale Price Tag

A [React Native](https://reactnative.dev) product screen shows a `PriceTag`
component for each item. When an item is on sale, the tag displays a small
discount badge like `-25%` next to the price. All of that logic funnels through
one helper:

```ts
discountLabel(priceCents: number, salePriceCents?: number): string | null
```

## Your task

`discountLabel` in `src/pricing.ts` currently always returns `null` (no badge is
ever shown). Implement it:

1. **On sale** — when `salePriceCents` is a finite number with
   `0 <= salePriceCents < priceCents`, return the discount as `-NN%`, where

   ```ts
   NN = Math.round(((priceCents - salePriceCents) / priceCents) * 100)
   ```

   The percentage is **rounded**, not truncated — a 32.5% discount shows as
   `-33%`, not `-32%`. (Tip: compute the discount from the cents *difference* as
   shown; `1 - salePriceCents / priceCents` loses precision and can round the
   wrong way.)
2. **No discount** — in every other case return `null`: there is no sale at all
   (`salePriceCents` is `undefined` or `NaN`), the sale price is equal to or
   higher than the regular price, or the sale price is negative.

The `PriceTag` component renders the badge only when `discountLabel` returns a
non-null string, so fixing the helper fixes the component too.

## Running it

```bash
npm install
npm test        # the visible tests
```

Hidden tests probe the rounding and the null edges — both on the helper and by
rendering the component with `@testing-library/react-native`.
