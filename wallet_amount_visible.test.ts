import { parseAmountToCents, validateTopUpAmount } from "../src/wallet/amount";

describe("wallet amount utilities (visible)", () => {
  it("parses a trimmed dollar amount into cents", () => {
    expect(parseAmountToCents("  $12.34 ")).toBe(1234);
  });

  it("rejects more than two decimals", () => {
    expect(parseAmountToCents("1.999")).toBeNull();
  });

  it("enforces minimum top-up", () => {
    expect(validateTopUpAmount("0.50")).toBe("Minimum top-up is $1.00");
  });
});
