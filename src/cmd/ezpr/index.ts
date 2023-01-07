import { View, WebClient } from "@slack/web-api";
import { Block, KnownBlock, SayFn } from "@slack/bolt";
import { ICommand } from "../interface";
import { OpenModalCommand } from "../modal";
import { ezprMessage } from "../../blocks";
import ezprModal from "../../blocks/ezpr/modal.json";
import { EZPRArguments } from "../../types";

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
