import { slashCommand } from "@slack-wrench/fixtures";

import { SLASH_CHOOSE } from "../constants";
import { ChooseArguments, ParseSlashChooseCommand } from ".";

describe("ParseSlashChooseCommand", () => {
  test("base usage, choose one person", async () => {
    const args = "@person";
    const input = slashCommand(SLASH_CHOOSE, { text: args });
    const expected = new ChooseArguments(
      1,
      ["@person"],
      "channel",
      [],
      1,
      SLASH_CHOOSE + " " + args
    );
    expect(ParseSlashChooseCommand(input)).toStrictEqual(expected);
  });

  test("choose one from two persons", async () => {
    const args = "@person1 @person2";
    const input = slashCommand(SLASH_CHOOSE, { text: args });
    const expected = new ChooseArguments(
      1,
      ["@person1", "@person2"],
      "channel",
      [],
      2,
      SLASH_CHOOSE + " " + args
    );
    expect(ParseSlashChooseCommand(input)).toStrictEqual(expected);
  });

  test("choose more than one persons", async () => {
    const args = "@person1 @person2 --n 2";
    const input = slashCommand(SLASH_CHOOSE, { text: args });
    const expected = new ChooseArguments(
      2,
      ["@person1", "@person2"],
      "channel",
      [],
      4,
      SLASH_CHOOSE + " " + args
    );
    expect(ParseSlashChooseCommand(input)).toStrictEqual(expected);
  });

  test("choose one person and exclude some", async () => {
    const args = "@person1 @person2 --exclude @person1";
    const input = slashCommand(SLASH_CHOOSE, { text: args });
    const expected = new ChooseArguments(
      1,
      ["@person1", "@person2"],
      "channel",
      ["@person1"],
      4,
      SLASH_CHOOSE + " " + args
    );
    expect(ParseSlashChooseCommand(input)).toStrictEqual(expected);
  });

  test("choose more than one persons and exclude some", async () => {
    const args = "@person1 @person2 --n 3 --exclude @person1 @person2";
    const input = slashCommand(SLASH_CHOOSE, { text: args });
    const expected = new ChooseArguments(
      3,
      ["@person1", "@person2"],
      "channel",
      ["@person1", "@person2"],
      7,
      SLASH_CHOOSE + " " + args
    );
    expect(ParseSlashChooseCommand(input)).toStrictEqual(expected);
  });
});
