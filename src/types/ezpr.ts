import { z } from "zod";
import {
  ChannelSchema,
  MentionSchema,
  MentionsSchema,
  PRLinkSchema,
  EstimatedReviewTimeSchema,
  PRDescriptionSchema,
} from ".";

const EZPRArgumentsSchema = z
  .object({
    submitter: MentionSchema,
    link: PRLinkSchema,
    ert: EstimatedReviewTimeSchema,
    description: PRDescriptionSchema,
    channel: ChannelSchema,
    role: MentionsSchema,
  })
  .partial({
    channel: true,
    role: true,
    input: true,
  });

export class EZPRArguments {
  submitter: string;
  link: string;
  ert: string;
  description: string;
  channel?: string;
  reviewers?: string[];
  input?: string;

  constructor(
    submitter: string,
    link: string,
    ert: string,
    description: string,
    reviewers: string[],
    channel?: string,
    input?: string
  ) {
    const args = {
      submitter: submitter,
      link: link,
      ert: ert,
      description: description,
      channel: channel,
      reviewers: reviewers,
      input: input,
    };
    EZPRArgumentsSchema.parse(args);

    this.submitter = submitter;
    this.link = link;
    this.ert = ert;
    this.description = description;
    this.channel = channel;
    this.reviewers = reviewers;
    this.input = input;
  }
}
