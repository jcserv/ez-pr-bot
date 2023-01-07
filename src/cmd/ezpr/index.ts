import { View, WebClient } from "@slack/web-api";
import { Block, KnownBlock, SayFn } from "@slack/bolt";
import { z } from "zod";
import {
  ChannelSchema,
  MentionSchema,
  PRLinkSchema,
  EstimatedReviewTimeSchema,
  PRDescriptionSchema,
} from "../../types";
import { ICommand } from "../interface";
import { OpenModalCommand } from "../modal";
import { ezprMessage } from "./blocks";
import ezprModal from "./ezprModal.json";

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

export class EZPRCommand implements ICommand {
  say: SayFn;

  input: string;
  channel: string;
  message: (KnownBlock | Block)[];
  text: string;

  constructor(say: SayFn, args: EZPRArguments) {
    this.say = say;
    this.input = args.input || "";
    this.message = ezprMessage(args);
    this.channel = args.channel || "";
    this.text = `${args.submitter} submitted a PR Review Request with an estimated review time of ${args.ert} to ${args.channel}\n${args.description}`;
  }

  async handle() {
    // ez pr bot needs to be in the channel
    // should be a valid role
    await this.say({
      blocks: this.message,
      channel: this.channel,
      text: this.text,
    })
      .then(() => console.log("PR Review Request submitted!"))
      .catch((error) => {
        throw error;
      });
  }
}

// OpenEZPRModal is a utility wrapper function that opens the modal version of /ezpr
export function OpenEZPRModal(client: WebClient, trigger_id: string) {
  const command = new OpenModalCommand(client, trigger_id, ezprModal as View);
  return command.handle();
}
