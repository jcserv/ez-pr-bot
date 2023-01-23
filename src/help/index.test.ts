import { slashCommand } from "@slack-wrench/fixtures";
import sinon from "sinon";

import {
  error,
  ezprHelp,
  HelpCommand,
  helpUsage,
  ParseSlashHelpCommand,
} from ".";
import helpOverview from "./overview.json";

describe("HelpCommand", () => {
  async function expectHelpCommand(args: string, expected: any) {
    const ackFn = sinon.fake.resolves({});
    const input = slashCommand("/help", { text: args });
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

describe("ParseSlashHelpCommand", () => {
  test("/help, should set input", async () => {
    const input = slashCommand("/help", { text: "" });
    expect(ParseSlashHelpCommand(input).input).toBe("/help ");
  });

  test("/help usage, should set input", async () => {
    const input = slashCommand("/help", { text: "usage" });
    expect(ParseSlashHelpCommand(input).input).toBe("/help usage");
  });
});
