import { EZPRArguments } from "./args";

describe("EZPRArguments", () => {
  test("happy path with minimum args", () => {
    expect(
      new EZPRArguments(
        "@jane.doe",
        "http://github.com/jcserv/ez-pr-bot/pulls/1",
        "15m",
        "desc"
      )
    ).toBeDefined();
  });

  test("happy path with all args", () => {
    expect(
      new EZPRArguments(
        "@jane.doe",
        "http://github.com/jcserv/ez-pr-bot/pulls/1",
        "15m",
        "description",
        "#test",
        ["@john.doe"],
        6,
        "input"
      )
    ).toBeDefined();
  });
});
