import { SlashCommand } from "@slack/bolt";

import { HTTPError } from "../errors";
import {
  isFlagProvided,
  mapUntilFlagEncountered,
  parseCommandArgs,
} from "../parse";
import { ChooseArguments } from "./args";

const MIN_SLASH_CHOOSE_ARGS = 1;
const NUM_FLAG = "--n";
const EXCLUDE_FLAG = "--exclude";

export function ParseSlashChooseCommand(
  payload: SlashCommand
): ChooseArguments {
  const args = parseCommandArgs(payload.text);
  const cmdInput = `${payload.command} ${payload.text}`;
  if (args.length < MIN_SLASH_CHOOSE_ARGS) {
    throw new HTTPError(400, "invalid number of arguments provided", cmdInput);
  }

  const amount: number = isFlagProvided(args, NUM_FLAG)
    ? +args[args.indexOf(NUM_FLAG) + 1]
    : 1;
  const include: string[] = mapUntilFlagEncountered(args);
  const exclude: string[] = isFlagProvided(args, EXCLUDE_FLAG)
    ? mapUntilFlagEncountered(args, args.indexOf(EXCLUDE_FLAG) + 1)
    : [];

  return new ChooseArguments(
    amount,
    include,
    payload.channel_name,
    exclude,
    args.length,
    cmdInput
  );
}
