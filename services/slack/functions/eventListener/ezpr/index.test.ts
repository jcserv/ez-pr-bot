/* eslint-disable @typescript-eslint/no-var-requires */

import { slashCommand } from "@slack-wrench/fixtures";

import {
  EZPRArguments,
  EZPRCommand,
  OpenEZPRModal,
  ParseEZPRSlashCommand,
} from ".";
import { ezprMessage, ezprText } from "./blocks";

const { WebClient } = require("@slack/web-api");

jest.mock("@slack/web-api");

function mockClientResponse(response: any) {
  WebClient.mockImplementation(() => {
    return {
      chat: {
        postMessage: () => {
          return response;
        },
      },
      views: {
        open: () => {
          return response;
        },
      },
    };
  });
}

describe("EZPRCommand", () => {
  test("happy path", async () => {
    const mockResponse = {
      ok: true,
    };

    mockClientResponse(mockResponse);
    const client = new WebClient({});
    const command = new EZPRCommand(
      client,
      new EZPRArguments(
        "U12345",
        "https://github.com/jcserv/ez-pr-bot/pulls/1",
        "15m",
        "Bug fix",
        "#channel"
      )
    );
    const result = await command.handle();
    expect(result.ok).toBeTruthy();
  });
});

describe("OpenEZPRModal", () => {
  test("happy path", async () => {
    const mockResponse = {
      ok: true,
    };

    mockClientResponse(mockResponse);
    const client = new WebClient({});
    const result = await OpenEZPRModal(client, "trigger-id");
    expect(result.ok).toBeTruthy();
  });
});

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

describe("EZPRArguments", () => {
  test("happy path with minimum args", () => {
    expect(
      new EZPRArguments(
        "U12345",
        "http://github.com/jcserv/ez-pr-bot/pulls/1",
        "15m",
        "desc",
        "#channel"
      )
    ).toBeDefined();
  });

  test("happy path with all args", () => {
    expect(
      new EZPRArguments(
        "U12345",
        "http://github.com/jcserv/ez-pr-bot/pulls/1",
        "15m",
        "description",
        "#test",
        ["U12345"],
        6,
        "input"
      )
    ).toBeDefined();
  });
});

describe("ezprMessage", () => {
  test("happy path", async () => {
    const input = new EZPRArguments(
      "U12345",
      "http://github.com/jcserv/ez-pr-bot/pulls/1",
      "15m",
      "desc",
      "#channel"
    );
    expect(ezprMessage(input)).toBeDefined();
  });
});

describe("ezprText", () => {
  test("happy path", async () => {
    const input = new EZPRArguments(
      "U12345",
      "http://github.com/jcserv/ez-pr-bot/pulls/1",
      "15m",
      "Fixes bug",
      "#channel"
    );
    const expected =
      "A PR Review Request was submitted to #channel with an estimated review time of 15 minutes | Fixes bug";
    expect(ezprText(input)).toBe(expected);
  });

  test("estimated review time not provided", async () => {
    const input = new EZPRArguments(
      "U12345",
      "http://github.com/jcserv/ez-pr-bot/pulls/1",
      "",
      "Fixes bug",
      "#channel"
    );
    const expected =
      "A PR Review Request was submitted to #channel | Fixes bug";
    expect(ezprText(input)).toBe(expected);
  });

  test("description not provided", async () => {
    const input = new EZPRArguments(
      "U12345",
      "http://github.com/jcserv/ez-pr-bot/pulls/1",
      "15m",
      "",
      "#channel"
    );
    const expected =
      "A PR Review Request was submitted to #channel with an estimated review time of 15 minutes";
    expect(ezprText(input)).toBe(expected);
  });

  test("description and ert not provided", async () => {
    const input = new EZPRArguments(
      "U12345",
      "http://github.com/jcserv/ez-pr-bot/pulls/1",
      "",
      "",
      "#channel"
    );
    const expected = "A PR Review Request was submitted to #channel";
    expect(ezprText(input)).toBe(expected);
  });
});
