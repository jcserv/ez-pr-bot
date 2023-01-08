import { SlashCommand } from "@slack/bolt";
import { HelpArguments } from "../../types";

export function ParseSlashHelpCommand(payload: SlashCommand): HelpArguments {
  const input = `${payload.command} ${payload.text}`;

  return new HelpArguments(payload.text, input);
}
