import { SlackViewAction, ViewOutput } from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import { FormValues, getInputValue } from "../parse";
import { GetNameByID } from "../cmd/getNameByID";
import {
  SELECTED_CONVERSATION,
  SELECTED_OPTION,
  SELECTED_USERS,
} from "../constants";
import { EZPRArguments, toMention, toMentions } from "../types";

const STATE = "state";
const VALUES = "values";

const PR_LINK = "pr_link";
const ERT = "estimated_review_time";
const DESCRIPTION = "description";
const CHANNEL = "channel";
const REVIEWERS = "reviewers";

export async function ParseEZPRFormSubmission(
  client: WebClient,
  body: SlackViewAction,
  payload: ViewOutput
): Promise<EZPRArguments> {
  const values = payload[STATE][VALUES];
  const { user } = body;
  const { url, ert, desc, channel, reviewers } = getInput(values);

  // Translate user ids of reviewers -> usernames -> mentions
  const reviewerNames = await Promise.all(
    reviewers.map(async (userId) => {
      const command = new GetNameByID(client, userId);
      const name = await command.handle();
      return name;
    })
  );
  return new EZPRArguments(
    toMention(user.name),
    url,
    ert,
    desc,
    toMentions(reviewerNames),
    channel
  );
}

class EZPRFormInput {
  url: string;
  ert: string;
  desc: string;
  channel: string;
  reviewers: string[];

  constructor(
    url: string,
    ert: string,
    desc: string,
    channel: string,
    reviewers: string[]
  ) {
    this.url = url;
    this.ert = ert;
    this.desc = desc;
    this.channel = channel;
    this.reviewers = reviewers;
  }
}

function getInput(values: FormValues) {
  const url = getInputValue(values, PR_LINK);
  const ert = getInputValue(values, ERT, SELECTED_OPTION);
  const desc = getInputValue(values, DESCRIPTION);
  const channel = getInputValue(values, CHANNEL, SELECTED_CONVERSATION);
  const reviewers = getInputValue(values, REVIEWERS, SELECTED_USERS);
  return new EZPRFormInput(url, ert, desc, channel, reviewers);
}
