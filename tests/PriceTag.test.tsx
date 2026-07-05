import { render, screen } from "@testing-library/react-native";

import { PriceTag } from "../src/PriceTag";

describe("PriceTag (visible)", () => {
  it("shows the sale price and the discount label when an item is on sale", () => {
    render(<PriceTag price={1000} salePrice={750} />);
    // Assert on what the shopper actually sees: the discounted price and the
    // badge copy, not internal identifiers.
    expect(screen.getByText("$7.50")).toBeOnTheScreen();
    expect(screen.getByText("-25%")).toBeOnTheScreen();
  });
});
