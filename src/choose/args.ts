import { z } from "zod";

import { Channel, ChannelSchema, Mention, MentionsSchema } from "../types";

const ChooseArgumentsSchema = z.object({
  amount: z.number().int().positive().or(z.literal(1)),
  include: MentionsSchema,
  channel: ChannelSchema,
  exclude: MentionsSchema,
  input: z.optional(z.string()),
  numArgs: z.number(),
});

export class ChooseArguments {
  amount: number;
  include: Mention[];
  channel: Channel;
  exclude: Mention[];
  numArgs: number;
  input?: string;

  constructor(
    amount: number,
    include: string[],
    channel: string,
    exclude: string[],
    numArgs: number,
    input?: string
  ) {
    const args = {
      amount,
      include,
      exclude,
      channel,
      input,
      numArgs,
    };

    ChooseArgumentsSchema.parse(args);

    this.amount = amount;
    this.include = include;
    this.exclude = exclude;
    this.channel = channel;
    this.input = input;
    this.numArgs = numArgs;
  }
}
