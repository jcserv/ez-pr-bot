import { SlashCommand } from "@slack/bolt";
import { EZPRArguments } from "../../types";
import { parseCommandArgs } from "..";
import { HTTPError } from "../../errors";

const MIN_SLASH_EZPR_ARGS = 3;
const MAX_SLASH_EZPR_ARGS = 5;

enum ArgIndices {
  PR_LINK = 0,
  ERT = 1,
  DESC = 2,
  ROLE = 3,
  CHANNEL = 4,
}

export function ParseSlashEZPRCommand(payload: SlashCommand): EZPRArguments {
  const args = parseCommandArgs(payload.text);

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

  return new EZPRArguments(
    payload.user_name,
    args[ArgIndices.PR_LINK],
    args[ArgIndices.ERT],
    args[ArgIndices.DESC],
    args.length > MIN_SLASH_EZPR_ARGS ? args[ArgIndices.ROLE] : "",
    channel
  );
}
