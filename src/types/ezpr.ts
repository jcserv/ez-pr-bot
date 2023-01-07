import { z } from "zod";
import {
  ChannelSchema,
  MentionSchema,
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
    role: MentionSchema,
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
  role?: string;
  input?: string;

  constructor(
    submitter: string,
    link: string,
    ert: string,
    description: string,
    role?: string,
    channel?: string,
    input?: string
  ) {
    const args = {
      submitter: submitter,
      link: link,
      ert: ert,
      description: description,
      channel: channel,
      role: role,
      input: input,
    };
    EZPRArgumentsSchema.parse(args);

    this.submitter = submitter;
    this.link = link;
    this.ert = ert;
    this.description = description;
    this.channel = channel;
    this.role = role;
    this.input = input;
  }
}
