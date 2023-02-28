import { SlashCommand } from "@slack/bolt";
import { WebClient } from "@slack/web-api";

import { GetIDsByNamesCommand } from "../cmd";
import { GetUsersInUserGroupCommand } from "../cmd/getUsersInUserGroups";
import { HTTPError } from "../errors";
import {
  isFlagProvided,
  mapUntilFlagEncountered,
  parseCommandArgs,
} from "../parse";
import { IsUserGroup, UserGroupToID } from "../types";
import { ChooseArguments } from "./args";

const MIN_SLASH_CHOOSE_ARGS = 1;
const NUM_FLAG = "--n";
const EXCLUDE_FLAG = "--exclude";

export async function ParseSlashChooseCommand(
  client: WebClient,
  payload: SlashCommand
): Promise<ChooseArguments> {
  const args = parseCommandArgs(payload.text);
  const cmdInput = `${payload.command} ${payload.text}`;
  if (args.length < MIN_SLASH_CHOOSE_ARGS) {
    throw new HTTPError(400, "invalid number of arguments provided", cmdInput);
  }

  const amount: number = isFlagProvided(args, NUM_FLAG)
    ? +args[args.indexOf(NUM_FLAG) + 1]
    : 1;
  const includeInput: string[] = mapUntilFlagEncountered(args);
  const excludeInput: string[] = isFlagProvided(args, EXCLUDE_FLAG)
    ? mapUntilFlagEncountered(args, args.indexOf(EXCLUDE_FLAG) + 1)
    : [];

  // get all usergroups from include/exclude
  // get all user ids from names

  const usergroups: string[] = [];
  const usernames: string[] = [];

  includeInput.concat(excludeInput).forEach((val) => {
    if (IsUserGroup(val)) {
      usergroups.push(UserGroupToID(val));
    } else {
      usernames.push(val.slice(1));
    }
  });

  const getIDsByNamesCmd = new GetIDsByNamesCommand(client, new Set(usernames));
  const usernamesToUserIDs = await getIDsByNamesCmd.handle();

  const getUsersInUserGroupsCmd = new GetUsersInUserGroupCommand(
    client,
    new Set(usergroups)
  );
  const userGroupToUsers = await getUsersInUserGroupsCmd.handle();

  const include: string[] = [];
  const exclude: string[] = [];

  includeInput.forEach((val) => {
    if (IsUserGroup(val)) {
      include.concat(userGroupToUsers.Entries[UserGroupToID(val)]);
    } else {
      include.push(usernamesToUserIDs.Entries[val.slice(1)]);
    }
  });
  excludeInput.forEach((val) => {
    if (IsUserGroup(val)) {
      exclude.concat(userGroupToUsers.Entries[UserGroupToID(val)]);
    } else {
      exclude.push(usernamesToUserIDs.Entries[val.slice(1)]);
    }
  });

  return new ChooseArguments(
    amount,
    include,
    payload.channel_name,
    exclude,
    args.length,
    cmdInput
  );
}
