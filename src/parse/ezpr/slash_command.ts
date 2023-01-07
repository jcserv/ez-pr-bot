import { SlashCommand } from "@slack/bolt";
import { EZPRArguments } from "../../cmd/ezpr";
import { parseCommandArgs } from "..";
import { HTTPError } from "../../errors";

enum ArgIndices {
  PR_LINK = 0,
  ERT = 1,
  DESC = 2,
  ROLE = 3,
  CHANNEL = 4,
}

export function ParseSlashCommand(payload: SlashCommand): EZPRArguments {
  const args = parseCommandArgs(payload.text);

  if (args.length < 3 || args.length > 5) {
    throw new HTTPError(
      400,
      "invalid number of arguments provided",
      `${payload.command} ${payload.text}`
    );
  }

  const channel =
    args.length == 5 ? args[ArgIndices.CHANNEL] : payload.channel_name;

  return new EZPRArguments(
    payload.user_name,
    args[ArgIndices.PR_LINK],
    args[ArgIndices.ERT],
    args[ArgIndices.DESC],
    args.length > 3 ? args[ArgIndices.ROLE] : "",
    channel
  );
}
