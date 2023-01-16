import { parseCommandArgs } from ".";

describe("parseCommandArgs", () => {
  test("empty string should result in zero results", () => {
    expect(parseCommandArgs("")).toStrictEqual([]);
  });

  test("singular arg should result in array containing that arg", () => {
    expect(parseCommandArgs("arg1")).toStrictEqual(["arg1"]);
  });

  test("singular arg wrapped in single quotes should be treated as one argument", () => {
    expect(parseCommandArgs("'Hello there!'")).toStrictEqual(["Hello there!"]);
  });

  test("singular arg wrapped in double quotes should be treated as one argument", () => {
    expect(parseCommandArgs('"Hello there!"')).toStrictEqual(["Hello there!"]);
  });

  test("multiple args should result in array containing those args", () => {
    expect(parseCommandArgs("arg1 arg2 arg3")).toStrictEqual([
      "arg1",
      "arg2",
      "arg3",
    ]);
  });

  test("mixed types of multiple args should result in array containing those args", () => {
    expect(
      parseCommandArgs("arg1 \"Hello there\" arg3 'Howdy!'")
    ).toStrictEqual(["arg1", "Hello there", "arg3", "Howdy!"]);
  });

  test("two side-by-side quote-wrapped args, should result in array with two args", () => {
    expect(parseCommandArgs('"15 minutes" "Adds help command"')).toStrictEqual([
      "15 minutes",
      "Adds help command",
    ]);
  });

  test("base usage of ezpr", () => {
    expect(parseCommandArgs('http://github.com "15m" "Adds help command"')).toStrictEqual([
      "http://github.com",
      "15m",
      "Adds help command",
    ]);
  });

  test("ascii double quotes", () => {
    expect(parseCommandArgs("“testing multiple reviewers”")).toStrictEqual([
      "testing multiple reviewers",
    ]);
  });
});
