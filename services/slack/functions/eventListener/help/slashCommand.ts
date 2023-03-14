import { SlashCommand } from "@slack/bolt";

import { HelpArguments } from ".";

export function ParseSlashHelpCommand(payload: SlashCommand): HelpArguments {
  const input = `${payload.command} ${payload.text}`;
  return new HelpArguments(payload.text, payload.text === "" ? 0 : 1, input);
}
