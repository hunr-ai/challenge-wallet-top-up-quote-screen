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

## Exact contract — types, API shapes, strings, and accessibility

Our automated checks assert these **exact** type shapes, method signatures, strings, and
accessibility labels. Match them verbatim (they are case- and punctuation-sensitive).

### Type shapes (exact field names)
- `WalletSummary`: `{ balanceCents: number; remainingDailyTopUpCents: number }`
- `TopUpQuote`: `{ amountCents: number; feeCents: number; resultingBalanceCents: number }`
- `WalletApi`:
  - `fetchWalletSummary(userId: string): Promise<WalletSummary>`
  - `createTopUpQuote(userId: string, amountCents: number): Promise<TopUpQuote>`
  - The screen calls `createTopUpQuote(userId, amountCents)` with those two positional
    arguments, in that order (e.g. `createTopUpQuote("u1", 1000)` for a `$10.00` top-up).

### `validateTopUpAmount` return strings (exact)
Return `null` when the amount is valid, otherwise exactly one of:
- Empty / non-numeric input → any non-empty string (message wording is your choice here).
- Zero or negative → `"Amount must be greater than $0.00"`
- Below the `$1.00` minimum → `"Minimum top-up is $1.00"`
- Above the `$500.00` maximum → `"Maximum single top-up is $500.00"`
- Above `summary.remainingDailyTopUpCents` → `"Amount exceeds your remaining daily limit"`

### `AddMoneyScreen` — exact on-screen text
- Loading state (while the summary is pending): `"Loading wallet summary..."`
- Current balance after load: `"Current balance: $20.00"` — i.e. the literal prefix
  `"Current balance: "` followed by `formatCents(balanceCents)`.
- Quote preview fee line: `"Fee: $0.30"` — the literal prefix `"Fee: "` followed by
  `formatCents(feeCents)`.
- Quote preview resulting balance line: `"Resulting balance: $29.70"` — the literal prefix
  `"Resulting balance: "` followed by `formatCents(resultingBalanceCents)`.
- Balance-load failure: `"Unable to load wallet balance. Please try again."`
- Quote failure: `"Could not fetch quote. Please try again."`
- Inline validation text renders the exact `validateTopUpAmount` strings above.

### `AddMoneyScreen` — exact accessibility labels and roles
The checks query the tree by accessible role and label (not test IDs), so these must be
reachable by their accessible name:
- The amount input must be labeled `"Top-up amount"` (e.g. `accessibilityLabel="Top-up amount"`),
  reachable via `getByLabelText("Top-up amount")`.
- The primary button must be an accessible **button** named `"Get quote"`
  (`accessibilityRole="button"`, accessible name `"Get quote"`), reachable via
  `getByRole("button", { name: "Get quote" })`. It is disabled while the summary is
  loading, while the amount is invalid, or while a quote request is in flight.
- The retry control (shown on balance-load failure) must be an accessible **button** named
  `"Retry"`, reachable via `getByRole("button", { name: "Retry" })`.
- On a quote failure, the screen keeps the user's typed amount (the input still shows what
  they typed) and ignores a stale/late quote response for a superseded amount.

## Deliverable
Submit the implemented files above with deterministic exports and a working `AddMoneyScreen`
that integrates the wallet utilities, API contract, async loading, validation, quote preview,
and error handling — matching the exact contract section above.

## Time box
Plan for about 60–90 minutes.
