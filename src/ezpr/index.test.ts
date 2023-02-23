import { slashCommand } from "@slack-wrench/fixtures";

import { EZPRArguments, ParseEZPRSlashCommand } from ".";
import { ezprMessage } from "./blocks";

describe("ParseEZPRSlashCommand", () => {
  test("/ezpr [pr link]", async () => {
    const args = "http://github.com/jcserv/ez-pr-bot/pulls/1";
    const input = slashCommand("/ezpr", { text: args });
    expect(ParseEZPRSlashCommand(input)).toBeDefined();
  });

  test("/ezpr [pr link] [estimated review time]", async () => {
    const args = "http://github.com/jcserv/ez-pr-bot/pulls/1 15m";
    const input = slashCommand("/ezpr", { text: args });
    expect(ParseEZPRSlashCommand(input)).toBeDefined();
  });

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

  test("/ezpr with user group, should parse out @mention", async () => {
    const args =
      'http://github.com/jcserv/ez-pr-bot/pulls/1 15m "Please review :)" <!subteam^S04HKF5MKRP|@ez-pr-devs>';
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
