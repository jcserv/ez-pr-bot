import { SlashCommand } from "@slack/bolt";

import { ChooseArguments } from "./args";

export function ParseSlashChooseCommand(
  payload: SlashCommand
): ChooseArguments {
  const input = `${payload.command} ${payload.text}`;
  return new ChooseArguments(payload.text, payload.text === "" ? 0 : 1, input);
}
