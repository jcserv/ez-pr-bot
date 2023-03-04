import { WebClient } from "@slack/web-api";

import { SlackMessage } from "../../@types";
import { ICommand } from "../../cmd";

export class PostMessageCommand implements ICommand {
  client: WebClient;
  message: SlackMessage;

  constructor(client: WebClient, message: SlackMessage) {
    this.client = client;
    this.message = message;
  }

  async handle() {
    const result = await this.client.chat.postMessage({
      blocks: this.message.blocks,
      channel: this.message.channel,
      text: this.message.text,
    });

    return result;
  }
}
