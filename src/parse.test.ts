import { parseCommandArgs } from "./parse";

describe("parseCommandArgs1", () => {
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

  test("EZPR-006", () => {
    // issue: terminateOnChar gets set to space
    expect(
      parseCommandArgs("\"15 minutes\" \"Adds help command\"")
    ).toStrictEqual(["15 minutes", "Adds help command"]);
  });
});
