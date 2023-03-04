import { SlashCommand } from "@slack/bolt";

import { toMention } from "../@lib/@types";
import { HTTPError } from "../@lib/errors";
import { parseCommandArgs } from "../@lib/parse";
import { EZPRArguments } from "./";

const MIN_SLASH_EZPR_ARGS = 1;
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
  const cmdInput = `${payload.command} ${payload.text}`;
  if (args.length < MIN_SLASH_EZPR_ARGS || args.length > MAX_SLASH_EZPR_ARGS) {
    throw new HTTPError(400, "invalid number of arguments provided", cmdInput);
  }

  const channel =
    args.length >= ArgIndices.CHANNEL + 1
      ? args[ArgIndices.CHANNEL]
      : payload.channel_name;

  const reviewers =
    args.length >= ArgIndices.REVIEWER + 1 ? [args[ArgIndices.REVIEWER]] : [];

  const ert = args.length >= ArgIndices.ERT + 1 ? args[ArgIndices.ERT] : "";
  const desc = args.length >= ArgIndices.DESC + 1 ? args[ArgIndices.DESC] : "";

  return new EZPRArguments(
    toMention(payload.user_id),
    args[ArgIndices.PR_LINK],
    ert,
    desc,
    channel,
    reviewers,
    args.length,
    cmdInput
  );
}
