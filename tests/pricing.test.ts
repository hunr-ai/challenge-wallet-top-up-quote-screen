import { discountLabel } from "../src/pricing";

describe("discountLabel (visible)", () => {
  it("formats a straightforward discount as -NN%", () => {
    expect(discountLabel(1000, 750)).toBe("-25%");
  });

  it("returns null when there is no sale price", () => {
    expect(discountLabel(1000)).toBeNull();
  });
});
