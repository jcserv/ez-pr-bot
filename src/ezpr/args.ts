import { z } from "zod";

import {
  ChannelSchema,
  EstimatedReviewTimeSchema,
  Mention,
  MentionSchema,
  MentionsSchema,
  PRDescriptionSchema,
  PRLinkSchema,
  PullRequest,
} from "../@lib/types";

const EZPRArgumentsSchema = z.object({
  submitter: MentionSchema,
  link: PRLinkSchema,
  ert: EstimatedReviewTimeSchema.or(z.literal("")),
  description: PRDescriptionSchema.or(z.literal("")),
  channel: ChannelSchema,
  reviewers: z.optional(MentionsSchema),
  numArgs: z.optional(z.number()),
  input: z.optional(z.string()),
});

export class EZPRArguments {
  submitter: Mention;
  pullRequest: PullRequest;
  ert: string;
  description: string;
  channel: string;
  reviewers?: Mention[];
  numArgs?: number;
  input?: string;

  constructor(
    submitter: string,
    link: string,
    ert: string,
    description: string,
    channel: string,
    reviewers?: string[],
    numArgs?: number,
    input?: string
  ) {
    const args = {
      submitter,
      link,
      ert,
      description,
      channel,
      reviewers,
      numArgs,
      input,
    };
    const obj = EZPRArgumentsSchema.parse(args);
    this.submitter = submitter;
    this.pullRequest = obj.link;
    this.ert = obj.ert;
    this.description = description;
    this.channel = channel;
    this.reviewers = reviewers;
    this.numArgs = numArgs;
    this.input = input;
  }
}
