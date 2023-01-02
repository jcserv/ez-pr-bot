import { WebClient } from "@slack/web-api";
import {
  AckFn,
  Block,
  KnownBlock,
  RespondArguments,
  SayFn,
  SlashCommand,
} from "@slack/bolt";
import { ICommand } from "../interface";
import { HTTPError } from "../../errors";
import { ezpr } from "./blocks";

export class EZPRArguments {
  submitter: string;
  link: string;
  // should start with \d\d
  // end with "m", "min", "minutes" or "h", "hrs", "hours"
  ert: string;

  // should be <200 characters
  description: string;

  // should start with #
  // ez pr bot needs to be in the channel
  channel?: string;

  // should start with @
  // should be a valid role
  role?: string;

  constructor(
    submitter: string,
    link: string,
    ert: string,
    description: string,
    channel?: string,
    role?: string
  ) {
    this.submitter = submitter;
    this.link = link;
    this.ert = ert;
    this.description = description;
    this.channel = channel;
    this.role = role;
  }
}

export class EZPRCommand implements ICommand {
  ack: AckFn<string | RespondArguments>;
  client: WebClient;
  say: SayFn;

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

    const args = payload.text.split(" ");
    if (args.length != 5) {
      throw new HTTPError(
        400,
        "invalid number of arguments provided",
        `${payload.command} ${payload.text}`
      );
    }

    this.channel = args[0];
    this.message = ezpr(new EZPRArguments(payload.user_name, args[2], args[3], args[4], args[0], args[1]));
  }

  async handle() {
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
