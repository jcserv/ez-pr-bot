import { slashCommand } from "@slack-wrench/fixtures";
import { ParseEZPRSlashCommand } from ".";
import { EZPRArguments } from "../types";
import { ezprMessage } from "./blocks";

describe("ParseEZPRSlashCommand", () => {
  test("/ezpr [pr link] [estimated review time] [description]", async () => {
    const args =
      'http://github.com/jcserv/ez-pr-bot/pulls/1 15m "Please review :)"';
    const input = slashCommand("/ezpr", { text: args });
    expect(ParseEZPRSlashCommand(input)).toBeDefined();
  });

  test("/ezpr [pr link] [estimated review time] [description] [@role]", async () => {
    const args =
      'http://github.com/jcserv/ez-pr-bot/pulls/1 15m "Please review :)" @jarrod.servilla';
    const input = slashCommand("/ezpr", { text: args });
    expect(ParseEZPRSlashCommand(input)).toBeDefined();
  });

  test("/ezpr [pr link] [estimated review time] [description] [@role] [#channel]", async () => {
    const args =
      'http://github.com/jcserv/ez-pr-bot/pulls/1 15m "Please review :)" @jarrod.servilla #test';
    const input = slashCommand("/ezpr", { text: args });
    expect(ParseEZPRSlashCommand(input)).toBeDefined();
  });
});

describe("ezprMessage", () => {
  test("happy path", async () => {
    const input = new EZPRArguments(
      "@jane.doe",
      "http://github.com/jcserv/ez-pr-bot/pulls/1",
      "15m",
      "desc"
    );
    expect(ezprMessage(input)).toBeDefined();
  });
});
