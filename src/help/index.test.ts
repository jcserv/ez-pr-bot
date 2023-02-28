/* eslint-disable @typescript-eslint/no-var-requires */

import { slashCommand } from "@slack-wrench/fixtures";
import sinon from "sinon";

import { SLASH_HELP } from "../constants";
import {
  error,
  ezprHelp,
  HelpArguments,
  HelpCommand,
  helpUsage,
  OpenHelpUsageModal,
  ParseSlashHelpCommand,
  renderMessage,
} from ".";
import helpOverview from "./overview.json";

const { WebClient } = require("@slack/web-api");

jest.mock("@slack/web-api");

function mockClientResponse(response: any) {
  WebClient.mockImplementation(() => {
    return {
      views: {
        open: () => {
          return response;
        },
      },
    };
  });
}

describe("HelpCommand", () => {
  async function expectHelpCommand(args: string, expected: any) {
    const ackFn = sinon.fake.resolves({});
    const input = slashCommand(SLASH_HELP, { text: args });
    const cmdArgs = ParseSlashHelpCommand(input);
    const cmd = new HelpCommand(ackFn, cmdArgs);
    expect(cmdArgs.message).toStrictEqual(expected);
    await cmd.handle();
    expect(
      ackFn.calledWith({
        blocks: expected,
        response_type: "ephemeral",
      })
    );
  }

  test("/help, should set message as helpOverview.blocks and call ack", async () => {
    const args = "";
    const expectedMessage = helpOverview.blocks;
    await expectHelpCommand(args, expectedMessage);
  });

  test("/help usage, should set message as helpUsage and call ack", async () => {
    const args = "usage";
    const expectedMessage = helpUsage;
    await expectHelpCommand(args, expectedMessage);
  });

  test("/help ezpr, should set message as ezprHelp and call ack", async () => {
    const args = "ezpr";
    const expectedMessage = ezprHelp;
    await expectHelpCommand(args, expectedMessage);
  });

  test("/help [unknown topic], should set message as error and call ack", async () => {
    const args = "swag";
    const expectedMessage = error(args);
    await expectHelpCommand(args, expectedMessage);
  });
});

describe("OpenHelpUsageModal", () => {
  test("happy path", async () => {
    const mockResponse = {
      ok: true,
    };

    mockClientResponse(mockResponse);
    const client = new WebClient({});
    const result = await OpenHelpUsageModal(client, "trigger-id");
    expect(result.ok).toBeTruthy();
  });
});

describe("ParseSlashHelpCommand", () => {
  test("/help, should set input", async () => {
    const input = slashCommand(SLASH_HELP, { text: "" });
    expect(ParseSlashHelpCommand(input).input).toBe(`${SLASH_HELP} `);
  });

  test("/help usage, should set input", async () => {
    const input = slashCommand(SLASH_HELP, { text: "usage" });
    expect(ParseSlashHelpCommand(input).input).toBe(`${SLASH_HELP} usage`);
  });
});

describe("HelpArguments", () => {
  describe("Constructor", () => {
    test("/help, should set message as helpOverview.blocks", () => {
      expect(new HelpArguments("").message).toBe(helpOverview.blocks);
    });

    test("/help usage, should set message as helpUsage", () => {
      expect(new HelpArguments("usage").message).toBe(helpUsage);
    });

    test("/help ezpr, should set message as ezPrHelp", () => {
      expect(new HelpArguments("ezpr").message).toBe(ezprHelp);
    });

    test("/help [unknown topic], should set message as error(topic)", () => {
      expect(new HelpArguments("swag").message).toStrictEqual(error("swag"));
    });
  });

  describe("renderMessage", () => {
    test("topic is empty, should return helpOverview.blocks", () => {
      expect(renderMessage("")).toBe(helpOverview.blocks);
    });

    test("/help usage, should set message as helpUsage", () => {
      expect(renderMessage("usage")).toBe(helpUsage);
    });

    test("/help ezpr, should set message as ezPrHelp", () => {
      expect(renderMessage("ezpr")).toBe(ezprHelp);
    });

    test("/help [unknown topic], should set message as error(topic)", () => {
      expect(renderMessage("swag")).toStrictEqual(error("swag"));
    });
  });
});
