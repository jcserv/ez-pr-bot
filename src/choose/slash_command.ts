import { SlashCommand } from "@slack/bolt";

import { HTTPError } from "../errors";
import { parseCommandArgs } from "../parse";
import { ChooseArguments } from "./args";

const MIN_SLASH_CHOOSE_ARGS = 1;
const MAX_SLASH_CHOOSE_ARGS = 5;

// enum ArgIndices {
//   PR_LINK = 0,
//   ERT = 1,
//   DESC = 2,
//   REVIEWER = 3,
//   CHANNEL = 4,
// }

export function ParseSlashChooseCommand(
  payload: SlashCommand
): ChooseArguments {
  const args = parseCommandArgs(payload.text);
  const cmdInput = `${payload.command} ${payload.text}`;
  if (
    args.length < MIN_SLASH_CHOOSE_ARGS ||
    args.length > MAX_SLASH_CHOOSE_ARGS
  ) {
    throw new HTTPError(400, "invalid number of arguments provided", cmdInput);
  }
  return new ChooseArguments(1, [], "", [], args.length, cmdInput);
}
