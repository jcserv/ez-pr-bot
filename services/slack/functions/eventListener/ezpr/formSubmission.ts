import { SlackViewAction, ViewOutput } from "@slack/bolt";

import { FormValues, getInputValue, toMention, toMentions } from "../@lib";
import {
  SELECTED_CONVERSATION,
  SELECTED_OPTION,
  SELECTED_USERS,
} from "../constants";
import { EZPRArguments } from ".";

const STATE = "state";
const VALUES = "values";

const PR_LINK = "pr_link";
const ERT = "estimated_review_time";
const DESCRIPTION = "description";
const CHANNEL = "channel";
const REVIEWERS = "reviewers";

export async function ParseEZPRFormSubmission(
  body: SlackViewAction,
  payload: ViewOutput
): Promise<EZPRArguments> {
  const values = payload[STATE][VALUES];
  const { user } = body;
  const { url, ert, desc, channel, reviewers } = getInput(values);

  return new EZPRArguments(
    toMention(user.id),
    url,
    ert,
    desc,
    channel,
    toMentions(reviewers),
    6
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
