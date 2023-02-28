import { SELECTED_CONVERSATION, SELECTED_USERS } from "../constants";
import {
  getInputValue,
  isFlagProvided,
  mapUntilFlagEncountered,
  parseCommandArgs,
} from ".";

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
    expect(
      parseCommandArgs('http://github.com "15m" "Adds help command"')
    ).toStrictEqual(["http://github.com", "15m", "Adds help command"]);
  });

  test("ascii double quotes", () => {
    expect(parseCommandArgs("“testing multiple reviewers”")).toStrictEqual([
      "testing multiple reviewers",
    ]);
  });
});

const mockFlag = "--TEST";

describe("isFlagProvided", () => {
  test("empty array, should return false", () => {
    expect(isFlagProvided([], mockFlag)).toBe(false);
  });

  test("flag is provided with one arg, should return true", () => {
    expect(isFlagProvided([mockFlag, "hi!"], mockFlag)).toBe(true);
  });

  test("flag is provided but no args after, should return false", () => {
    expect(isFlagProvided([mockFlag], mockFlag)).toBe(false);
  });
});

describe("mapUntilFlagEncountered", () => {
  test("empty array input, should return empty array", () => {
    expect(mapUntilFlagEncountered([])).toStrictEqual([]);
  });

  test("first argument is a flag, should return empty array", () => {
    expect(mapUntilFlagEncountered([mockFlag])).toStrictEqual([]);
  });

  test("some args then a flag, should return those args before flag", () => {
    expect(mapUntilFlagEncountered(["hi", "bye", mockFlag])).toStrictEqual([
      "hi",
      "bye",
    ]);
  });
});

describe("getInputValue", () => {
  test("minimum usage", () => {
    const formVals = {
      block_id: {
        input: {
          type: "string",
          value: "foobar",
        },
      },
    };
    expect(getInputValue(formVals, "block_id")).toBe("foobar");
  });

  test("specify value key SELECTED_CONVERSATION", () => {
    const formVals = {
      block_id: {
        input: {
          type: "string",
          selected_conversation: "foobar",
        },
      },
    };
    expect(getInputValue(formVals, "block_id", SELECTED_CONVERSATION)).toBe(
      "foobar"
    );
  });

  test("specify value key SELECTED_USERS", () => {
    const formVals = {
      block_id: {
        input: {
          type: "string",
          selected_users: ["foobar"],
        },
      },
    };
    expect(getInputValue(formVals, "block_id", SELECTED_USERS)).toStrictEqual([
      "foobar",
    ]);
  });

  test("unsupported value key", () => {
    const formVals = {
      block_id: {
        input: {
          type: "string",
          val1: "foobar",
        },
      },
    };
    expect(getInputValue(formVals, "block_id", "val1")).toBeNull();
  });
});
