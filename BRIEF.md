# Wallet Top-Up Quote Screen

## Product context
The merchant wallet experience is expanding so sellers can add funds before purchasing inventory. We need a standalone React Native screen where a wallet user can enter a top-up amount, validate it, load their wallet balance and limits, and preview the fee and resulting balance before any money moves.

## User story
As a wallet user, I want to enter an amount to add to my wallet and see a validated quote before confirming, so that I know the fee and resulting balance before money moves.

## Acceptance criteria
- Add a shared currency helper in `src/pricing.ts`:
  - Export `formatCents(cents: number): string`.
  - Format integer cents as US dollar strings such as `$0.00`, `$12.34`, and `-$5.00`.
  - Preserve the existing `discountLabel` behavior.
- Add wallet amount utilities in `src/wallet/amount.ts`:
  - Export `parseAmountToCents(input: string): number | null`.
  - Export `validateTopUpAmount(input: string, summary?: WalletSummary): string | null`.
  - Support trimmed input and an optional leading `$`.
  - Allow at most two decimal places.
  - Reject empty, non-numeric, zero, and negative amounts.
  - Enforce a minimum top-up of `$1.00` and maximum single top-up of `$500.00`.
  - When a wallet summary is available, reject amounts above `summary.remainingDailyTopUpCents`.
- Add the wallet API contract in `src/wallet/api.ts`:
  - Export types `WalletSummary`, `TopUpQuote`, and `WalletApi`.
  - Export `defaultWalletApi` for use when the screen is not given an injected API.
- Add `src/AddMoneyScreen.tsx`:
  - Export named component `AddMoneyScreen`.
  - Export type `AddMoneyScreenProps` with `{ userId: string; api?: WalletApi }`.
  - Use `api ?? defaultWalletApi`.
  - Fetch the wallet summary when the screen mounts and show a loading state while it is pending.
  - Render an amount `TextInput`, current balance text after load, inline validation/error text, and a quote preview showing fee and resulting balance when available.
  - Request a `TopUpQuote` only when the user presses the primary button with a currently valid amount.
  - Disable the primary button while the summary is loading, while the amount is invalid, or while a quote request is in progress.
  - Surface balance-load and quote failures in user-friendly text, provide a retry path for the balance load, and do not clear the user’s typed amount on failures.

## Constraints
- Build exactly against these public surfaces and file paths:
  - `src/pricing.ts`
  - `src/wallet/amount.ts`
  - `src/wallet/api.ts`
  - `src/AddMoneyScreen.tsx`
- Keep the screen as a React Native implementation suitable for `@testing-library/react-native` interaction.
- Reuse `formatCents` for wallet currency display instead of duplicating formatting logic.
- Keep form, loading, success, and error states predictable and easy to follow.

## Deliverable
Submit the implemented files above with deterministic exports and a working `AddMoneyScreen` that integrates the wallet utilities, API contract, async loading, validation, quote preview, and error handling.

## Time box
Plan for about 60–90 minutes.