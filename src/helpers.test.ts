import { formatNItems } from "./helpers";

describe("formatNItems", () => {
  test("empty array, should return empty string", () => {
    expect(formatNItems([])).toBe("");
  });

  test("array of one item, should return that item", () => {
    expect(formatNItems(["hi"])).toBe("hi");
  });

  test("array of two items, should return items joined with and", () => {
    expect(formatNItems(["hi", "bye"])).toBe("hi and bye");
  });

  test("array of three items, should return items formatted", () => {
    expect(formatNItems(["hi", "bye", "cry"])).toBe("hi, bye, and cry");
  });

  test("array of four items, should return items formatted", () => {
    expect(formatNItems(["hi", "bye", "cry", "deny"])).toBe(
      "hi, bye, cry, and deny"
    );
  });
});
