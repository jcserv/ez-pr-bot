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
} from "./model";

const EZPRArgumentsSchema = z.object({
  submitter: MentionSchema,
  link: PRLinkSchema,
  ert: EstimatedReviewTimeSchema,
  description: PRDescriptionSchema,
  channel: z.optional(ChannelSchema),
  reviewers: z.optional(MentionsSchema),
  numArgs: z.optional(z.number()),
  input: z.optional(z.string()),
});

export class EZPRArguments {
  submitter: Mention;
  pullRequest: PullRequest;
  ert: string;
  description: string;
  channel?: string;
  reviewers?: Mention[];
  numArgs?: number;
  input?: string;

  constructor(
    submitter: string,
    link: string,
    ert: string,
    description: string,
    channel?: string,
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

    // eslint-disable-next-line no-console
    const pr = EZPRArgumentsSchema.parse(args) as unknown as PullRequest;
    this.submitter = submitter;
    this.pullRequest = pr;
    this.ert = ert;
    this.description = description;
    this.channel = channel;
    this.reviewers = reviewers;
    this.numArgs = numArgs;
    this.input = input;
  }
}
