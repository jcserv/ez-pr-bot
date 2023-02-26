import { Block, KnownBlock } from "@slack/bolt";
import { z } from "zod";

export declare type UserID = string;

const NewUserIDSchema = z.string().trim().startsWith("U");
const LegacyUserIDSchema = z.string().startsWith("W");

export const UserIDSchema = NewUserIDSchema.or(LegacyUserIDSchema);

export const UserIDAsMentionSchema = UserIDSchema.transform(
  (val) => `<@${val}>`
);

export declare type UserGroup = string;

const userGroupRegex = /^<!subteam\^S[\w]{10}\|@[\w+\-?]+>$/;

export const userGroupErrorMsg =
  "Invalid input: expected a Slack UserGroup, ex: <!subteam^S01ABC2DEFG|@ez-pr-devs>";

export const UserGroupSchema = z
  .string()
  .trim()
  .regex(userGroupRegex, { message: userGroupErrorMsg });

export const UserGroupAsMentionSchema = UserGroupSchema.transform((val) =>
  val.substring(val.indexOf("|") + 1, val.length - 1)
);

export declare type Mention = string;

export const MentionSchema = z
  .string()
  .trim()
  .transform((val) => {
    if (val.startsWith("@")) {
      return val;
    }
    return "@" + val;
  });

export function toMention(val: string): Mention {
  return MentionInputSchema.parse(val);
}

export const MentionInputSchema = z.union([
  UserGroupAsMentionSchema,
  UserIDAsMentionSchema,
  MentionSchema,
]);

export declare type Mentions = Mention[];

export const MentionsSchema = z
  .array(MentionSchema)
  .transform((vals) => toMentions(vals));

export function toMentions(usernames: string[]): Mentions {
  const mentions: Mentions = [];
  usernames.forEach((username) => mentions.push(toMention(username)));
  return mentions;
}

export declare type Channel = string;

// payload.channel_name provides the channel name without the # at front, so we don't validate #'s
export const ChannelSchema = z.string().trim();

export class SlackMessage {
  blocks: (KnownBlock | Block)[];
  channel: Channel;
  text: string;

  constructor(blocks: (KnownBlock | Block)[], channel: Channel, text: string) {
    this.blocks = blocks;
    this.channel = channel;
    this.text = text;
  }
}
