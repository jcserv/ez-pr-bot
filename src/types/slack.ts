import { Block, KnownBlock } from "@slack/bolt";
import { z } from "zod";

export declare type UserID = string;

const NewUserIDSchema = z.string().trim().startsWith("U");
const LegacyUserIDSchema = z.string().startsWith("W");

export const UserIDSchema = NewUserIDSchema.or(LegacyUserIDSchema);

export declare type Mention = string;

export declare type Mentions = Mention[];

export function toMentions(usernames: string[]): Mentions {
  const mentions: Mentions = [];
  usernames.forEach((username) => mentions.push(toMention(username)));
  return mentions;
}

export function toMention(username: string): Mention {
  if (!username.startsWith("@")) {
    username = "@" + username;
  }
  MentionSchema.parse(username);
  return username;
}

export const MentionSchema = z.string().startsWith("@");

export const MentionsSchema = z.array(MentionSchema);

export declare type UserGroup = string;

export function IsUserGroup(s: string): boolean {
  return s.startsWith("<!subteam");
}

export const UserGroupToMentionStringSchema = z
  .string()
  .startsWith("<!subteam")
  .transform((val) => val.substring(val.indexOf("|") + 1, val.length - 1));

export declare type Channel = string;

// payload.channel_name provides the channel name without the # at front, so we don't validate #'s
export const ChannelSchema = z.string().trim();

export declare type SlackMessage = {
  blocks: (KnownBlock | Block)[];
  channel: Channel;
  text: string;
};
