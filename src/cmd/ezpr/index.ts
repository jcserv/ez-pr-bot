import { WebClient } from "@slack/web-api";
import {
  AckFn,
  Block,
  KnownBlock,
  RespondArguments,
  SayFn,
  SlashCommand,
} from "@slack/bolt";
import { z } from "zod";
import { HTTPError } from "../../errors";
import { ICommand } from "../interface";
import { ezpr } from "./blocks";
import { parseCommandArgs } from "../../parse";
import {
  ChannelSchema,
  MentionSchema,
  PRLinkSchema,
  EstimatedReviewTimeSchema,
  PRDescriptionSchema,
} from "../../types";

enum ArgIndices {
  PR_LINK = 0,
  ERT = 1,
  DESC = 2,
  CHANNEL = 3,
  ROLE = 4,
}

const ACCEPTED_NUM_ARGS = [3, 5];

export class EZPRCommand implements ICommand {
  ack: AckFn<string | RespondArguments>;
  client: WebClient;
  say: SayFn;

  input: string;
  channel: string;
  message: (KnownBlock | Block)[];

  constructor(
    ack: AckFn<string | RespondArguments>,
    client: WebClient,
    say: SayFn,
    payload: SlashCommand
  ) {
    this.ack = ack;
    this.client = client;
    this.say = say;

    this.input = `${payload.command} ${payload.text}`;
    const args = parseCommandArgs(payload.text);

    if (!ACCEPTED_NUM_ARGS.includes(args.length)) {
      throw new HTTPError(
        400,
        "invalid number of arguments provided",
        `${payload.command} ${payload.text}`
      );
    }

    this.message = ezpr(
      new EZPRArguments(
        payload.user_name,
        args[ArgIndices.PR_LINK],
        args[ArgIndices.ERT],
        args[ArgIndices.DESC],
        args[ArgIndices.CHANNEL],
        args.length == 5 ? args[ArgIndices.ROLE] : ""
      )
    );

    this.channel =
      args.length == 5 ? args[ArgIndices.CHANNEL] : payload.channel_name;
  }

  async handle() {
    // ez pr bot needs to be in the channel
    // should be a valid role

    await this.say({
      blocks: this.message,
      channel: this.channel,
    })
      .then(() => console.log("PR Review Request submitted!"))
      .catch((error) => {
        throw error;
      });

    this.ack();
  }
}

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
  });

export class EZPRArguments {
  submitter: string;
  link: string;
  ert: string;
  description: string;
  channel?: string;
  role?: string;

  constructor(
    submitter: string,
    link: string,
    ert: string,
    description: string,
    channel?: string,
    role?: string
  ) {
    const args = {
      submitter: submitter,
      link: link,
      ert: ert,
      description: description,
      channel: channel,
      role: role,
    };
    EZPRArgumentsSchema.parse(args);

    this.submitter = submitter;
    this.link = link;
    this.ert = ert;
    this.description = description;
    this.channel = channel;
    this.role = role;
  }
}
