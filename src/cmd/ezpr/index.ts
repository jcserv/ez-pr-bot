import { View, WebClient } from "@slack/web-api";
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
import { parseCommandArgs } from "../../parse";
import { ICommand } from "../interface";
import { OpenModalCommand } from "../modal";
import {
  ChannelSchema,
  MentionSchema,
  PRLinkSchema,
  EstimatedReviewTimeSchema,
  PRDescriptionSchema,
} from "../../types";
import { ezprMessage } from "./blocks";
import ezprModal from "./ezprModal.json";

enum ArgIndices {
  PR_LINK = 0,
  ERT = 1,
  DESC = 2,
  ROLE = 3,
  CHANNEL = 4,
}

export class EZPRCommand implements ICommand {
  say: SayFn;

  input: string;
  channel: string;
  message: (KnownBlock | Block)[];
  text: string;

  constructor(say: SayFn, payload: SlashCommand) {
    this.say = say;

    this.input = `${payload.command} ${payload.text}`;
    const args = parseCommandArgs(payload.text);

    if (args.length < 3 || args.length > 5) {
      throw new HTTPError(
        400,
        "invalid number of arguments provided",
        `${payload.command} ${payload.text}`
      );
    }

    const channel =
      args.length == 5 ? args[ArgIndices.CHANNEL] : payload.channel_name;

    const ezPRArgs = new EZPRArguments(
      payload.user_name,
      args[ArgIndices.PR_LINK],
      args[ArgIndices.ERT],
      args[ArgIndices.DESC],
      args.length > 3 ? args[ArgIndices.ROLE] : "",
      channel
    );

    this.message = ezprMessage(ezPRArgs);
    this.channel = channel;
    this.text = `${ezPRArgs.submitter} submitted a PR Review Request with an estimated review time of ${ezPRArgs.ert} to ${channel}\n${ezPRArgs.description}`;
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
    role?: string,
    channel?: string
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

// OpenEZPRModal is a utility wrapper function that opens the modal version of /ezpr
export function OpenEZPRModal(client: WebClient, trigger_id: string) {
  const command = new OpenModalCommand(client, trigger_id, ezprModal as View);
  return command.handle();
}
