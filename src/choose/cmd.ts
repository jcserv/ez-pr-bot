import { Block } from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import _ from "lodash";

import { ICommand } from "../types";
import { ChooseArguments } from "./";
import { diceMessages } from "./blocks";

export class ChooseCommand implements ICommand {
  client: WebClient;

  input: string;
  channel: string;
  args: ChooseArguments;

  constructor(client: WebClient, args: ChooseArguments) {
    this.client = client;
    this.args = args;
    this.channel = args.channel || "";
    this.input = args.input || "";
  }

  generateMessages(chosen: string[]): Block[][] {
    switch (chosen.length) {
      case 1:
        return diceMessages;
    }
    return diceMessages;
  }

  async handle() {
    const chosen = _.sampleSize(
      _.difference(this.args.include, this.args.exclude),
      this.args.amount
    );
    const messages = this.generateMessages(chosen);

    messages.forEach(async (msg) => {
      await this.client.chat
        .postMessage({
          blocks: msg,
          channel: this.channel,
          text: "",
        })
        .catch((error) => {
          throw error;
        });
    });
  }
}
