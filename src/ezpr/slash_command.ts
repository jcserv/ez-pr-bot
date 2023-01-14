import { SlashCommand } from "@slack/bolt";
import { EZPRArguments, toMention } from "../types";
import { parseCommandArgs } from "../parse";
import { HTTPError } from "../errors";

const MIN_SLASH_EZPR_ARGS = 3;
const MAX_SLASH_EZPR_ARGS = 5;

enum ArgIndices {
  PR_LINK = 0,
  ERT = 1,
  DESC = 2,
  REVIEWER = 3,
  CHANNEL = 4,
}

export function ParseEZPRSlashCommand(payload: SlashCommand): EZPRArguments {
  const args = parseCommandArgs(payload.text);
  console.log(args);
  if (args.length < MIN_SLASH_EZPR_ARGS || args.length > MAX_SLASH_EZPR_ARGS) {
    throw new HTTPError(
      400,
      "invalid number of arguments provided",
      `${payload.command} ${payload.text}`
    );
  }

  const channel =
    args.length == MAX_SLASH_EZPR_ARGS
      ? args[ArgIndices.CHANNEL]
      : payload.channel_name;

  const reviewer =
    args.length > MIN_SLASH_EZPR_ARGS ? [args[ArgIndices.REVIEWER]] : [];

  return new EZPRArguments(
    toMention(payload.user_name),
    args[ArgIndices.PR_LINK],
    args[ArgIndices.ERT],
    args[ArgIndices.DESC],
    reviewer,
    channel
  );
}
