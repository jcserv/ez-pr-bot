import { message } from "@slack-wrench/fixtures/lib/events";
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

export declare type PullRequest = {
  website: string;
  org: string;
  repo: string;
  num: string;
  link: string;
};

function prLinkToPullRequest(link: string, regex: RegExp): PullRequest {
  let pullRequest: PullRequest = {
    website: "",
    org: "",
    repo: "",
    num: "",
    link: "",
  };
  const matches = link.match(regex);
  if (matches == null || matches.length !== 5) {
    return pullRequest;
  }
  pullRequest = {
    website: matches[1],
    org: matches[2],
    repo: matches[3],
    num: matches[4],
    link: matches[0],
  };
  return pullRequest;
}

export declare type PRLink = string;

const bitbucketURLRegex =
  /^http[s]*:\/\/(bitbucket).org\/([\w|-]+)\/([\w|-]+)\/pull-requests\/(\d+)$/;

export const bitbucketErrorMsg =
  "Invalid input: expected a Bitbucket pull request url, ex: https://bitbucket.org/my-group/my-repo/pull-requests/123";

export const BitbucketURLSchema = z
  .string()
  .trim()
  .url()
  .regex(bitbucketURLRegex, {
    message: bitbucketErrorMsg,
  })
  .transform((val) => prLinkToPullRequest(val, bitbucketURLRegex));

const githubURLRegex =
  /^http[s]*:\/\/(github).com\/([\w|-]+)\/([\w|-]+)\/pulls\/(\d+$)/;

export const githubErrorMsg =
  "Invalid input: expected a Github pull request url, ex: https://github.com/my-group/my-repo/pulls/123";

export const GithubURLSchema = z
  .string()
  .trim()
  .url()
  .regex(githubURLRegex, {
    message: githubErrorMsg,
  })
  .transform((val) => prLinkToPullRequest(val, githubURLRegex));

const gitlabURLRegex =
  /^http[s]*:\/\/(gitlab).com\/([\w|-]+)\/([\w|-]+)\/merge_requests\/(\d+)$/;

export const gitlabErrorMsg =
  "Invalid input: expected a Gitlab merge request url, ex: https://gitlab.com/my-group/my-repo/merge_requests/123";

export const GitlabURLSchema = z
  .string()
  .trim()
  .url()
  .regex(gitlabURLRegex, {
    message: gitlabErrorMsg,
  })
  .transform((val) => prLinkToPullRequest(val, gitlabURLRegex));

export const PRLinkSchema = z.union([
  GithubURLSchema,
  BitbucketURLSchema,
  GitlabURLSchema,
]);

export declare type EstimatedReviewTime = string;

export function translateInputToHumanReadable(s: string): string {
  let output = "";
  let i = 0;

  while (i < s.length && s.charAt(i) !== "h" && s.charAt(i) !== "m") {
    if (s.charAt(i) !== " ") {
      output += s.charAt(i);
    }
    i++;
  }
  const isPlural = parseInt(output.trim()) > 1;

  if (s.charAt(i) === "h") {
    output += " hour";
  } else {
    output += " minute";
  }
  if (isPlural) {
    output += "s";
  }
  return output;
}

const ertRegex = /^(\d){1,2}( )?(hour|minute|min|hr|m|h)(s)?$/;

export const ertErrorMsg =
  "Invalid input: must start with 1 or 2 digits and end with a support time unit";

export const EstimatedReviewTimeSchema = z.string().trim().regex(ertRegex, {
  message: ertErrorMsg,
});

export declare type PRDescription = string;

export const PRDescriptionSchema = z.string().trim().min(0).max(200);
