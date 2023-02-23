import { Block, KnownBlock } from "@slack/bolt";
import { View, WebClient } from "@slack/web-api";

import { OpenModalCommand } from "../cmd/openModal";
import { logger } from "../logger";
import { EZPRArguments, ICommand } from "../types";
import { ezprMessage, ezprText } from "./blocks";
import ezprModal from "./modal.json";

export class EZPRCommand implements ICommand {
  client: WebClient;

  input: string;
  channel: string;
  message: (KnownBlock | Block)[];
  text: string;

  constructor(client: WebClient, args: EZPRArguments) {
    this.client = client;
    this.input = args.input || "";
    this.message = ezprMessage(args);
    this.channel = args.channel || "";
    this.text = ezprText(args);
  }

  async handle() {
    // ez pr bot needs to be in the channel
    // should be a valid role

    await this.client.chat
      .postMessage({
        blocks: this.message,
        channel: this.channel,
        text: this.text,
      })
      .then(() => logger.info("PR Review Request submitted!"))
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
