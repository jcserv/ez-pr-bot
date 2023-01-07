import { ViewOutput } from "@slack/bolt";
import { FormValues, getInputValue } from "..";
import { EZPRArguments } from "../../types";

export function ParseEZPRFormSubmission(payload: ViewOutput): EZPRArguments {
  const values = payload["state"]["values"];
  const { url, ert, desc, channel } = getInput(values);
  return new EZPRArguments("", url, ert, desc, "", channel);
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
  const url = getInputValue(values, "pr_link");
  const ert = getInputValue(values, "estimated_review_time", "selected_option");
  const desc = getInputValue(values, "description");
  const channel = getInputValue(values, "channel", "selected_conversation");
  const reviewers = getInputValue(values, "channel", "selected_users");
  return new EZPRFormInput(url, ert, desc, channel, reviewers);
}
